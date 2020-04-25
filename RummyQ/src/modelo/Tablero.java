package modelo;

import java.util.*;

/**
 * Clase tablero
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Tablero {

    /**
     * Default constructor
     */
    public Tablero() {
    }

    /**
     * 
     */
    private LinkedList listas;

    /**
     * 
     */
    private Banca banca;

    public LinkedList getListas() {
        return listas;
    }

    public void setListas(LinkedList listas) {
        this.listas = listas;
    }

    public Banca getBanca() {
        return banca;
    }

    public void setBanca(Banca banca) {
        this.banca = banca;
    }

    
}