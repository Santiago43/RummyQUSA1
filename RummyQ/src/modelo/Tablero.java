package modelo;

import java.util.LinkedList;

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
    private Ficha[][] listas;

    /**
     * 
     */
    private Banca banca;

    public Ficha[][] getListas() {
        return listas;
    }

    public void setListas(Ficha[][] listas) {
        this.listas = listas;
    }

    public Banca getBanca() {
        return banca;
    }

    public void setBanca(Banca banca) {
        this.banca = banca;
    }
    /**
    * Columnas es el primer componente
    * Filas es el segundo componente
    */
    public void aumentarFilas(){
        Ficha[][] listasNuevas = new Ficha [this.listas.length+1][this.listas[0].length];
        for (int i = 0; i < this.listas.length; i++) {
            for (int j = 0; j < this.listas[0].length; j++) {
                listasNuevas[i][j] = this.listas[i][j];
            }
        }   
        this.listas = listasNuevas;
    }
    
}