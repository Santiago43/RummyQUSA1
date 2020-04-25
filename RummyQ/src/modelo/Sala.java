package modelo;

import java.util.LinkedList;

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
     */
    public Sala(int codigo) {
        this.tablero = new Tablero();
        this.codigo=codigo;
        this.usuarios= new LinkedList();
    }

    /**
     * 
     */
    private Tablero tablero;

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

    public void setTablero(Tablero tablero) {
        this.tablero = tablero;
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
}