package funciones;

import java.util.LinkedList;
import modelo.Sala;
import modelo.Usuario;
import org.java_websocket.WebSocket;

/**
 * Clase que genera fichas
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Buscador {
    public static Usuario buscarUsuario(WebSocket ws,LinkedList<Usuario> lista){
        for (int i = 0; i < lista.size(); i++) {
            if(lista.get(i).getWebSocket().equals(ws)){
                return lista.get(i);
            }
        }
        return null;
    }
    
    public static Sala buscarSala(int codigo, LinkedList<Sala> salas){
        for (int i = 0; i < salas.size(); i++) {
            if(salas.get(i).getCodigo()==codigo){
                return salas.get(i);
            }
        }
        return null;
    }
}
