package servidor;

import funciones.Buscador;
import funciones.Generador;
import java.net.InetSocketAddress;
import java.util.LinkedList;
import modelo.Sala;
import modelo.Usuario;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONObject;

/**
 * Servidor
 *
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Servidor extends WebSocketServer {

    private LinkedList<Usuario> usuarios;
    private LinkedList<Sala> salas;

    public Servidor(InetSocketAddress address) {
        super(address);
        this.usuarios = new LinkedList();
        this.salas = new LinkedList();
    }

    @Override
    public void onOpen(WebSocket ws, ClientHandshake ch) {
        System.out.println("Nuevo usuario conectado: " + ws.getRemoteSocketAddress() + " hash " + ws.getRemoteSocketAddress().hashCode());
        Usuario usuario = new Usuario();
        usuario.setHash(ws.getRemoteSocketAddress().hashCode());
        usuario.setWebSocket(ws);
        this.usuarios.add(usuario);
        String objeto = "{\"tipo\":\"hash\",\"hash\":\"" + usuario.getHash() + "\"}";
        ws.send(objeto);
    }

    @Override
    public void onClose(WebSocket ws, int p, String razon, boolean bln) {
        System.out.println("Client " + p + " disconnected: " + razon);
        for (int i = 0; i < usuarios.size(); i++) {
            if (usuarios.get(i).getWebSocket().equals(i)) {
                usuarios.remove(i);
                break;
            }
        }
    }

    @Override
    public void onMessage(WebSocket ws, String mensaje) {
        JSONObject obj = new JSONObject(mensaje);
        String tipo = (String) obj.get("tipo");
        Usuario usuario = null;
        Sala sala = null;
        String objeto = "";
        switch (tipo) {
            case "ping":
                ws.send("pong");
                break;
            case "crear sala":
                int numeroSala = Generador.generarNumeroSala();
                sala = new Sala(numeroSala, "Sala: " + numeroSala);
                this.salas.add(sala);
                usuario = Buscador.buscarUsuario(ws, usuarios);
                if (usuario == null) {
                    System.out.println("Error");
                    objeto = "{\"tipo\":\"error\",\"mensaje\":\"ese usuario no existe\"}";
                    ws.send(objeto);
                } else {
                    usuario.setNombre((String) obj.get("nombre"));
                    objeto = "{\"tipo\":\"codigo sala\",\"código\":\"" + sala.getCodigo() + "\"}";
                    usuario.setSala(sala);
                    ws.send(objeto);
                }
                break;
            case "conectarse a sala":
                int codigo = obj.getInt("codigo");
                usuario = Buscador.buscarUsuario(ws, usuarios);
                sala = Buscador.buscarSala(codigo, salas);
                usuario.setSala(sala);
                sala.getUsuarios().add(usuario);
                objeto = "{\"tipo\":\"nuevo jugador\"}";
                sala.enviarATodosEnSalaExceptoA(usuario.getWebSocket(), objeto);
                objeto = "{\"tipo\":\"participantes\",\"participantes\":\"" + sala.getUsuarios().size() + "\"}";
                ws.send(objeto);
                break;
            case "desconectarse de sala":
                usuario = Buscador.buscarUsuario(ws, usuarios);
                sala = Buscador.buscarSala(usuario.getSala().getCodigo(), salas);
                sala.getUsuarios().remove(usuario);
                usuario.setSala(null);
                objeto = "{\"tipo\":\"jugador salió\",\"participantes\":\"" + sala.getUsuarios().size() + "\"}";
                sala.enviarATodosEnSalaExceptoA(usuario.getWebSocket(), objeto);
                objeto = "{\"tipo\":\"confirmación salida\",\"mensaje\":\"Usted salió\"}";
                ws.send(objeto);
                break;
            case "iniciar partida":
                usuario = Buscador.buscarUsuario(ws, usuarios);
                sala = usuario.getSala();
                sala.start();
                System.out.println("El juego ha iniciado en " + sala.getName());
                break;
            case "jugada - colocar ficha":
                usuario = Buscador.buscarUsuario(ws, usuarios);
                sala = usuario.getSala();
                sala.colocarFicha(usuario, obj);
                break;
            case "jugada - mover ficha":
                usuario = Buscador.buscarUsuario(ws, usuarios);
                sala = usuario.getSala();
                sala.moverFicha(usuario, obj);
                break;
            case "jugada - robar ficha":
                usuario = Buscador.buscarUsuario(ws, usuarios);
                sala = usuario.getSala();
                sala.robarFicha(usuario,obj);
                break;
            case "terminar turno":
                usuario = Buscador.buscarUsuario(ws, usuarios);
                usuario.getSala().terminarTurno(usuario);
                break;
            default:
                break;
        }
    }

    /**
     *
     * @param ws
     * @param excptn
     */
    @Override
    public void onError(WebSocket ws, Exception excptn) {
        System.out.println("");
    }

}
