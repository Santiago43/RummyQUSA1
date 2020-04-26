package modelo;

import java.util.LinkedList;
import org.java_websocket.WebSocket;

/**
 * Clase usuario
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Usuario {

    /**
     * Default constructor
     */
    public Usuario() {
        this.desbloqueado = false;
    }

    /**
     * 
     */
    private String nombre;

    /**
     * 
     */
    private WebSocket webSocket;

    /**
     * 
     */
    private int hash;
    
    /**
     * 
     */
    private Sala sala;
    
    /**
     * 
     */
    private LinkedList <Ficha> mano;
    
    /**
     * 
     */
    private boolean desbloqueado;
    
    /**
     * 
     */
    private boolean enTurno;
    /**
     * 
     * @return 
     */
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public WebSocket getWebSocket() {
        return webSocket;
    }

    public void setWebSocket(WebSocket webSocket) {
        this.webSocket = webSocket;
    }

    public int getHash() {
        return hash;
    }

    public void setHash(int hash) {
        this.hash = hash;
    }

    public LinkedList <Ficha> getMano() {
        return mano;
    }

    public void setMano(LinkedList <Ficha> mano) {
        this.mano = mano;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public boolean isDesbloqueado() {
        return desbloqueado;
    }

    public void setDesbloqueado(boolean desbloqueado) {
        this.desbloqueado = desbloqueado;
    }

    public boolean isEnTurno() {
        return enTurno;
    }

    public void setEnTurno(boolean enTurno) {
        this.enTurno = enTurno;
    }
    
}