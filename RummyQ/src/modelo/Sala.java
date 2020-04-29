package modelo;

import funciones.Generador;
import java.util.LinkedList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.java_websocket.WebSocket;

/**
 * Clase Sala
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Sala extends Thread{

    /**
     * Default constructor
     * @param codigo
     * @param name
     */
    public Sala(int codigo,String name) {
        super(name);
        this.tablero = new Tablero();
        this.codigo=codigo;
        this.usuarios= new LinkedList();
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
        LinkedList <Ficha> fichas = Generador.revolverFichas();
        for (int i = 0; i < this.usuarios.size(); i++) {
            LinkedList <Ficha> mano = this.usuarios.get(i).getMano();
            for (int j = 0; j < 7; j++) {
                mano.add(fichas.removeFirst());
                mano.add(fichas.removeLast());
            }
        }
        Banca banca = new Banca();
        banca.setFichas(fichas);
        this.tablero.setBanca(banca);  
        juego:
        while(true){
            turno:
            for (Usuario usuario : this.usuarios) {
                usuario.setEnTurno(true); 
                synchronized(this.tablero){
                    try {
                        this.tablero.wait();
                    } catch (InterruptedException ex) {
                        Logger.getLogger(Sala.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                usuario.setEnTurno(false);
                if(usuario.getMano().isEmpty()){
                    this.anunciarGanador(usuario);
                }
            }
        }
    }
    public void anunciarGanador(Usuario usuarioGanador){
        for (Usuario usuario : this.usuarios) {
            String objeto= "{\"tipo\":\"ganador\",\"ganador\":\""+usuarioGanador.getNombre()+"\"}";
            usuario.getWebSocket().send(objeto);
        }
    }
    
        /**
     * 
     * @param ws
     * @param mensaje 
     */
    public void enviarATodosEnSala(WebSocket ws,String mensaje){
        for(int i =0;i<usuarios.size();i++) {
    		WebSocket c = (WebSocket)usuarios.get(i).getWebSocket();
            if (c != ws) c.send(mensaje);
    	}
    }
}