package modelo;

/**
 * Clase ficha
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Ficha {

    /**
     * Default constructor
     */
    public Ficha() {
    }

    /**
     * 
     */
    private int numero;

    /**
     * 
     */
    private int color;
    
    /**
     * 
     */
    private int x;
    
    /**
     * 
     */
    private int y;
    
    /**
     * 
     */
    private int xAnterior;
    /**
     * 
     */
    private int yAnterior;
    
    /**
     * 
     */
    private int xInicial;
    /**
     * 
     */
    private int yInicial;
    
    /**
     * 
     * @return 
     */

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public int getColor() {
        return color;
    }

    public void setColor(int color) {
        this.color = color;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getxAnterior() {
        return xAnterior;
    }

    public void setxAnterior(int xAnterior) {
        this.xAnterior = xAnterior;
    }

    public int getyAnterior() {
        return yAnterior;
    }

    public void setyAnterior(int yAnterior) {
        this.yAnterior = yAnterior;
    }

    
    public String toJson() {
        return "{" + "\"numero\":\"" + numero + "\", \"color\":\"" + color + "\", \"x\":\"" + x + "\", \"y\":\"" + y + "\", \"xAnterior\":\"" + xAnterior + "\", \"yAnterior\":\"" + yAnterior + "\", \"xInicial\":\""+xInicial+"\",\"yInicial\":\""+yInicial+"\"}";
    }    

    public int getxInicial() {
        return xInicial;
    }

    public void setxInicial(int xInicial) {
        this.xInicial = xInicial;
    }

    public int getyInicial() {
        return yInicial;
    }

    public void setyInicial(int yInicial) {
        this.yInicial = yInicial;
    }
}