package modelo;

import funciones.Generador;
import funciones.Verificador;
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
        this.tablero.setListas(new Ficha[19][7]);
        this.codigo = codigo;
        this.usuarios = new LinkedList();
    }

    /**
     * El tablero de juego de esta sala
     */
    private final Tablero tablero;

    /**
     * Lista de usuarios
     */
    private LinkedList<Usuario> usuarios;

    /**
     * El código de la sala
     */
    private final int codigo;

    /**
     *
     * @return
     */
    public Tablero getTablero() {
        return tablero;
    }

    /**
     *
     * @return
     */
    public LinkedList getUsuarios() {
        return usuarios;
    }

    /**
     *
     * @param usuarios
     */
    public void setUsuarios(LinkedList usuarios) {
        this.usuarios = usuarios;
    }

    /**
     *
     * @return
     */
    public int getCodigo() {
        return codigo;
    }

    /**
     * Función que contiene el hilo de ejecución del juego
     */
    @Override
    public void run() {
        super.run();
        LinkedList<Ficha> nuevasFichas = Generador.crearFichas();
        LinkedList<Ficha> fichas = Generador.revolverFichas(nuevasFichas);
        generarLog("Iniciando la partida");
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
                manoNueva += "{\"nombre\": \"" + this.usuarios.get(j).getNombre() + "\","
                        + "\"hash\":" + this.usuarios.get(j).getHash() + "}";
                if (j != this.usuarios.size() - 1) {
                    manoNueva += ",";
                }
            }
            manoNueva += "]}";
            this.usuarios.get(i).getWebSocket().send(manoNueva);
        }
        Banca banca = new Banca();
        banca.setFichas(fichas);
        this.tablero.setBanca(banca);
        boolean primerTurno = true;

        juego:
        while (true) {
            int i = 0;
            if (primerTurno) {
                i = (int) (this.usuarios.size() * (Math.random()));
                primerTurno = false;
            }
            turno:
            for (; i < this.usuarios.size(); i++) {

                Usuario usuario = this.usuarios.get(i);
                usuario.setEnTurno(true);
                usuario.setSuma(0);
                String mensajeGlobal = "{\"tipo\": \"turno\",\"jugador\":"
                        + "\"" + usuario.getNombre() + "\"}";
                generarLog("Es el turno de: " + usuario.getNombre());
                this.enviarATodosEnSala(mensajeGlobal);
                String mensajeUsuario = "{\"tipo\":\"cambio turno\",\"valor\":" + usuario.isEnTurno() + "}";
                usuario.getWebSocket().send(mensajeUsuario);

                /**
                 * Solamente el usuario en turno puede modificar el tablero, por
                 * tanto, se bloquea hasta que termine el turno.
                 */
                synchronized (this.tablero) {
                    try {
                        this.tablero.wait();
                    } catch (InterruptedException ex) {
                        Logger.getLogger(Sala.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                usuario.setEnTurno(false);
                mensajeUsuario = "{\"tipo\":\"cambio turno\",\"valor\":" + usuario.isEnTurno() + "}";
                usuario.getWebSocket().send(mensajeUsuario);
                generarLog("Terminó el turno de: " + usuario.getNombre());
                ajustarTablero();
                if (usuario.getMano().isEmpty()) {
                    this.anunciarGanador(usuario);
                    System.out.println("Terminando juego en la sala " + this.codigo);
                    break juego;
                }
            }
        }
    }

    /**
     * Función que permite mostrar el ganador de la partida
     *
     * @param usuarioGanador que es el usuario ganador
     */
    public void anunciarGanador(Usuario usuarioGanador) {
        for (Usuario usuario : this.usuarios) {
            String objeto = "{\"tipo\":\"ganador\",\"ganador\":\"" + usuarioGanador.getNombre() + "\"}";
            usuario.getWebSocket().send(objeto);
        }
        generarLog("Terminó la partida. El ganador fue " + usuarioGanador.getNombre());
    }

    /**
     * Método que permite enviar un mensaje a todos los miembros de la sala,
     * excepto a quien ejecuta la acción de enviar el mensaje
     *
     * @param ws que es el websocket de quien envía el mensaje
     * @param mensaje que es el mensaje que se envía a todos
     */
    public void enviarATodosEnSalaExceptoA(WebSocket ws, String mensaje) {
        for (int i = 0; i < usuarios.size(); i++) {
            WebSocket c = (WebSocket) usuarios.get(i).getWebSocket();
            if (c != ws) {
                System.out.println("Enviando a " + usuarios.get(i).getNombre());
                c.send(mensaje);
            }
        }
    }

    /**
     * Método que permite enviar un mensaje a todos los miembros de la sala
     *
     * @param mensaje que es el mensaje que se envía
     */
    public void enviarATodosEnSala(String mensaje) {
        for (int i = 0; i < usuarios.size(); i++) {
            this.usuarios.get(i).getWebSocket().send(mensaje);
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
            if (this.tablero.getListas()[x][y] == null) {
                this.tablero.getListas()[x][y] = ficha;
                ficha.setX(x);
                ficha.setY(y);
                usuario.setSuma(usuario.getSuma() + ficha.getNumero());
                String fichaNueva = "{\"tipo\": \"colocar ficha\",\"ficha\":" + ficha.toJson() + "}";
                this.enviarATodosEnSalaExceptoA(usuario.getWebSocket(), fichaNueva);
            } else {
                this.enviarError("Hay una ficha en ese lugar", usuario);
                usuario.getMano().add(ficha);
                String mensaje = "{\"tipo\": \"corregir ficha\",\"subtipo\":\"colocar ficha\",\"ficha\": " + ficha.toJson() + ", \"fichaPrevia\":" + this.tablero.getListas()[x][y].toJson() + "}";
                usuario.getWebSocket().send(mensaje);
            }

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
        Ficha ficha = this.tablero.getListas()[xAnterior][yAnterior];
        ficha.setxAnterior(xAnterior);
        ficha.setyAnterior(yAnterior);
        if (usuario.isDesbloqueado()) {
            if (this.tablero.getListas()[x][y] == null) {
                this.tablero.getListas()[x][y] = ficha;
                ficha.setX(x);
                ficha.setY(y);
                String fichaNueva = "{\"tipo\": \"mover ficha\",\"ficha\":" + ficha.toJson() + "}";
                this.enviarATodosEnSalaExceptoA(usuario.getWebSocket(), fichaNueva);
                this.tablero.getListas()[xAnterior][yAnterior] = null;
            } else {
                this.enviarError("hay una ficha en ese lugar", usuario);
                ficha.setX(xAnterior);
                ficha.setY(yAnterior);
                this.tablero.getListas()[xAnterior][yAnterior] = ficha;
                String mensaje = "{\"tipo\": \"corregir ficha\",\"subtipo\":\"mover ficha\",\"ficha\": " + ficha.toJson() + ", \"fichaPrevia\":" + this.tablero.getListas()[x][y].toJson() + "}";
                usuario.getWebSocket().send(mensaje);
            }
        } else {
            if (ficha.getxInicial() == -1) {
                if (this.tablero.getListas()[x][y] == null) {
                    this.tablero.getListas()[x][y] = ficha;
                    ficha.setX(x);
                    ficha.setY(y);
                    String fichaNueva = "{\"tipo\": \"mover ficha\",\"ficha\":" + ficha.toJson() + "}";
                    this.enviarATodosEnSalaExceptoA(usuario.getWebSocket(), fichaNueva);
                    this.tablero.getListas()[xAnterior][yAnterior] = null;
                } else {
                    this.enviarError("hay una ficha en ese lugar", usuario);
                    ficha.setX(xAnterior);
                    ficha.setY(yAnterior);
                    this.tablero.getListas()[xAnterior][yAnterior] = ficha;
                    String mensaje = "{\"tipo\": \"corregir ficha\",\"subtipo\":\"mover ficha\",\"ficha\": " + ficha.toJson() + ", \"fichaPrevia\":" + this.tablero.getListas()[x][y].toJson() + "}";
                    usuario.getWebSocket().send(mensaje);
                }
            } else {
                this.enviarError("Tu no puedes usar esa ficha", usuario);
            }
        }

    }

    public void enviarError(String mensaje, Usuario usuario) {
        String error = "{\"tipo\": \"error\",\"mensaje\": \"" + mensaje + "\"}";
        usuario.getWebSocket().send(error);
    }

    public void robarFicha(Usuario usuario) {
        Ficha ficha = this.tablero.getBanca().robarFicha();
        String mensaje = "{\"tipo\":";
        if (ficha != null) {
            mensaje += "\"ficha robada\",\"ficha\":"
                    + ficha.toJson() + "}";
            usuario.getMano().add(ficha);
        } else {
            mensaje += "\"ficha no robada\"}";
        }
        usuario.getWebSocket().send(mensaje);
        //terminarTurno(usuario);
    }

    /**
     * Función que permite terminar turno
     *
     * @param usuario es el usuario que termina el turno
     */
    public void terminarTurno(Usuario usuario) {
        if (usuario.isEnTurno()) {
            String mensajeUsuario = "";
            if (!Verificador.jugadaValida(tablero.getListas())) {
                mensajeUsuario = "{\"tipo\": \"jugada inválida\"}";
                usuario.getWebSocket().send(mensajeUsuario);
                return;
            } else {
                if (usuario.getSuma() == 0) {
                    this.robarFicha(usuario);
                } else {
                    if (!usuario.isDesbloqueado()) {
                        if (usuario.getSuma() >= 30) {
                            usuario.setDesbloqueado(true);
                        } else {
                            this.enviarError("No tiene los puntos para iniciar", usuario);
                            return;
                        }
                    }
                    mensajeUsuario = "{\"tipo\": \"jugada válida\"}";
                    usuario.getWebSocket().send(mensajeUsuario);
                }

            }
            synchronized (this.tablero) {
                this.tablero.notify();
            }
            generarLog(mensajeUsuario);
        }
    }

    public void generarLog(String mensaje) {
        System.out.println(this.getName() + ": " + mensaje);
    }

    public void devolverFicha(Usuario usuario, JSONObject obj) {
        JSONObject fichaDevuelta = obj.getJSONObject("ficha");
        int div = obj.getInt("div");
        int xAnterior = fichaDevuelta.getInt("xAnterior");
        int yAnterior = fichaDevuelta.getInt("yAnterior");
        Ficha ficha = this.tablero.getListas()[xAnterior][yAnterior];
        if (ficha.getxInicial() == -1) {
            usuario.getMano().add(ficha);
            String mensaje = "{\"tipo\": \"borrar ficha\",\"x\": \"" + xAnterior + "\",\"y\":\"" + yAnterior + "\"}";
            this.enviarATodosEnSalaExceptoA(usuario.getWebSocket(), mensaje);
            mensaje = "{\"tipo\": \"ficha devuelta\",\"ficha\": " + ficha.toJson() + ",\"idDiv\":\"" + div + "\"}";
            generarLog(mensaje);
            usuario.setSuma(usuario.getSuma() - ficha.getNumero());
            usuario.getWebSocket().send(mensaje);
            this.tablero.getListas()[xAnterior][yAnterior] = null;
        } else {
            String mensaje = "{\"tipo\": \"colocar ficha\",\"ficha\":" + ficha.toJson() + "}";
            usuario.getWebSocket().send(mensaje);
        }
    }

    private void ajustarTablero() {
        for (int i = 0; i < this.tablero.getListas().length; i++) {
            for (int j = 0; j < this.tablero.getListas()[0].length; j++) {
                if (this.tablero.getListas()[i][j] != null) {
                    Ficha ficha = this.tablero.getListas()[i][j];
                    ficha.setxInicial(ficha.getX());
                    ficha.setyInicial(ficha.getY());
                }
            }
        }
    }
}
