package modelo;

import funciones.Generador;
import java.util.LinkedList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.java_websocket.WebSocket;
import org.json.JSONObject;

/**
 * Clase Sala
 *
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Sala extends Thread {

    /**
     * Default constructor
     *
     * @param codigo
     * @param name
     */
    public Sala(int codigo, String name) {
        super(name);
        this.tablero = new Tablero();
        this.tablero.setListas(new Ficha[13][4]);
        this.codigo = codigo;
        this.usuarios = new LinkedList();
    }

    /**
     *
     */
    private final Tablero tablero;

    /**
     *
     */
    private LinkedList<Usuario> usuarios;

    /**
     *
     */
    private final int codigo;

    /**
     *
     * @return
     */
    public Tablero getTablero() {
        return tablero;
    }

    public LinkedList getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(LinkedList usuarios) {
        this.usuarios = usuarios;
    }

    public int getCodigo() {
        return codigo;
    }

    @Override
    public void run() {
        super.run();
        LinkedList<Ficha> nuevasFichas = Generador.crearFichas();
        LinkedList<Ficha> fichas = Generador.revolverFichas(nuevasFichas);
        for (int i = 0; i < this.usuarios.size(); i++) {
            LinkedList<Ficha> mano = this.usuarios.get(i).getMano();
            String manoNueva = "{ "
                    + "\"tipo\": \"nueva mano\","
                    + "\"mano\": [";
            for (int j = 0; j < 7; j++) {
                mano.add(fichas.removeFirst());
                manoNueva += mano.getLast().toJson() + ",";
                mano.add(fichas.removeLast());
                manoNueva += mano.getLast().toJson();
                if (j != 6) {
                    manoNueva += ",";
                }
            }
            manoNueva += "]"
                    + ",\"jugadores\":[";
            for (int j = 0; j < this.usuarios.size(); j++) {
                manoNueva+= "{\"nombre\": \""+this.usuarios.get(i).getNombre()+"\"}";
                if (j!=this.usuarios.size()-1) {
                    manoNueva+=",";
                }
            }
            manoNueva+= "]}";
            this.usuarios.get(i).getWebSocket().send(manoNueva);
        }
        Banca banca = new Banca();
        banca.setFichas(fichas);
        this.tablero.setBanca(banca);
        juego:
        while (true) {
            turno:
            for (Usuario usuario : this.usuarios) {
                usuario.setEnTurno(true);
                synchronized (this.tablero) {
                    try {
                        this.tablero.wait();
                    } catch (InterruptedException ex) {
                        Logger.getLogger(Sala.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                usuario.setEnTurno(false);
                if (usuario.getMano().isEmpty()) {
                    this.anunciarGanador(usuario);
                    System.out.println("Terminando juego en la sala "+this.codigo);
                    break juego;
                }
            }
        }
    }

    public void anunciarGanador(Usuario usuarioGanador) {
        for (Usuario usuario : this.usuarios) {
            String objeto = "{\"tipo\":\"ganador\",\"ganador\":\"" + usuarioGanador.getNombre() + "\"}";
            usuario.getWebSocket().send(objeto);
        }
    }

    /**
     *
     * @param ws
     * @param mensaje
     */
    public void enviarATodosEnSala(WebSocket ws, String mensaje) {
        for (int i = 0; i < usuarios.size(); i++) {
            WebSocket c = (WebSocket) usuarios.get(i).getWebSocket();
            if (c != ws) {
                c.send(mensaje);
            }
        }
    }

    /**
     * Método que coloca una ficha en el tablero
     *
     * @param usuario
     * @param obj
     */
    public void colocarFicha(Usuario usuario, JSONObject obj) {
        JSONObject fichaNuevaObj = obj.getJSONObject("ficha");
        if (usuario.isEnTurno()) {
            int x = fichaNuevaObj.getInt("x");
            int y = fichaNuevaObj.getInt("y");
            int color = fichaNuevaObj.getInt("color");
            int numero = fichaNuevaObj.getInt("numero");
            Ficha ficha = null;
            for (int i = 0; i < usuario.getMano().size(); i++) {
                if (usuario.getMano().get(i).getColor() == color) {
                    if (usuario.getMano().get(i).getNumero() == numero) {
                        ficha = usuario.getMano().remove(i);
                        break;
                    }
                }
            }
            //try {
            this.tablero.getListas()[x][y] = ficha;
            ficha.setX(x);
            ficha.setY(y);
            ficha.setxAnterior(-1);
            ficha.setyAnterior(-1);
            String fichaNueva = "{\"tipo\": \"colocar ficha\",\"ficha\":" + ficha.toJson() + "}";
            this.enviarATodosEnSala(usuario.getWebSocket(), fichaNueva);
            //} catch (IndexOutOfBoundsException ex) {
            /*this.tablero.aumentarFilas();
                if(x<0){
                    int i =0;
                    while(tablero.getListas()[i][]){   
                    }    
                }else if(x>13){
                    
                }
            }*/
        } else {
            this.enviarError("tú no estás en turno", usuario); 
        }
    }

    public void moverFicha(Usuario usuario, JSONObject obj) {
        JSONObject fichaMovida = obj.getJSONObject("ficha");
        int x = fichaMovida.getInt("x");
        int y = fichaMovida.getInt("y");
        //int color = fichaMovida.getInt("color");
        //int numero = fichaMovida.getInt("numero");
        int xAnterior = fichaMovida.getInt("xAnterior");
        int yAnterior = fichaMovida.getInt("yAnterior");
        try {
            Ficha ficha = this.tablero.getListas()[xAnterior][yAnterior];
            this.tablero.getListas()[xAnterior][yAnterior] = null;
            ficha.setxAnterior(xAnterior);
            ficha.setyAnterior(yAnterior);
            if (this.tablero.getListas()[x][y] != null) {
                this.tablero.getListas()[x][y] = ficha;
                ficha.setX(x);
                ficha.setY(y);
                String fichaNueva = "{\"tipo\": \"mover ficha\",\"ficha\":" + ficha.toJson() + "}";
                this.enviarATodosEnSala(usuario.getWebSocket(), fichaNueva);
            }
            else{
                this.enviarError("hay una ficha en ese lugar", usuario);
            }
        } catch (IndexOutOfBoundsException ex) {
            if (x < 0) {
                this.tablero.aumentarFilas();
                obj.put("x", 0);
                obj.put("y", this.tablero.getListas()[0].length-1);
                moverFicha(usuario,obj);
                int i=0;
                while(this.tablero.getListas()[i][y]!=null){
                    obj.put("x",i+1);
                    //obj.put("", usuarios)
                }
                
            } else if (x > 13) {

            }
        }

    }
    
    public void enviarError(String mensaje, Usuario usuario){
        String error = "{\"tipo\": \"error\",\"mensaje\": \""+mensaje+"\"}";
        usuario.getWebSocket().send(error);
    }
}
