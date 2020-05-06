package modelo;

import java.util.*;

/**
 * Clase banca
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Banca {

    /**
     * Default constructor
     */
    public Banca() {
    }

    /**
     * 
     */
    private LinkedList<Ficha> fichas;
    /**
     * 
     * @return 
     */
    public LinkedList getFichas() {
        return fichas;
    }
    /**
     * 
     * @param fichas 
     */
    public void setFichas(LinkedList fichas) {
        this.fichas = fichas;
    }

    /**
     * 
     * @return 
     */
    public Ficha robarFicha(){
        if (!this.fichas.isEmpty()){
            return this.fichas.removeLast();
        }
        return null;
    }
    
}