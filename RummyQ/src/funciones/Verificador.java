package funciones;

import java.util.LinkedList;
import modelo.Ficha;

/**
 * Clase que contiene métodos para verificar una escalera o un trío en el tablero
 *
 * @author Santiago Pérez
 * @version 0.0.1
 * @since 2020-05-03
 */
public class Verificador {
    /**
     * Método que permite verificar si una jugada es válida
     * @param tablero que es el tablero donde se juega
     * @return verdadero si es válida y falso si no
     */
    public static boolean jugadaValida(Ficha[][] tablero) {
        for (int i = 0; i < tablero[0].length; i++) {
            for (int j = 0; j < tablero.length; j++) {
                if (tablero[j][i] != null) {
                    LinkedList <Ficha> lista = new LinkedList();
                    while(tablero.length>(j+1)){
                        if(tablero[j][i]!=null){
                            lista.add(tablero[j][i]);
                            j++;
                        }else{
                            break;
                        }
                    }
                    if(!esTrio(lista)){
                        if(!esEscalera(lista)){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    /**
     * Método que permite ver si un conjunto de fichas es un trío
     * @param lista que es la lista de fichas en el tablero que están continuas
     * @return verdadero si es un trío y falso si no
     */
    private static boolean esTrio(LinkedList<Ficha> lista) {
        if (lista.size() > 4||lista.size()<3) {
            return false;
        } else {
            Ficha primeraFicha = lista.get(0);
            int valor = primeraFicha.getNumero();
            if(valor ==0){
                Ficha segundaFicha = lista.get(1);
                valor = segundaFicha.getNumero();
                if(valor==0){
                    Ficha terceraFicha = lista.get(2);
                    valor = terceraFicha.getNumero();
                }
            }
            LinkedList<Integer> coloresPresentes = new LinkedList();
            for (int i = 0; i < lista.size(); i++) {
                if (lista.get(i).getNumero()==valor) {
                    if(!colorDentro(coloresPresentes,lista.get(i).getColor())){
                        coloresPresentes.add(lista.get(i).getColor());
                    }else{
                        return false;
                    }
                }else if(lista.get(i).getNumero()!=0){
                    return false;
                }
            }
        }
        return true;
    }
    
    private static boolean colorDentro(LinkedList<Integer> colores,int color){
        for (int i = 0; i < colores.size(); i++) {
            if(colores.get(i)==color){
                return true;
            }
        }
        return false;
    }
    
    public static boolean esEscalera(LinkedList<Ficha> lista){
        if(lista.size()<3 || lista.size()>13){
            return false;
        }
        else{
            Ficha primeraFicha = lista.get(0);
            int color = primeraFicha.getColor();
            if(primeraFicha.getNumero()==0){
                Ficha segundaFicha = lista.get(1);
                color = segundaFicha.getColor();
                if(segundaFicha.getNumero()==0){
                    Ficha terceraFicha = lista.get(2);
                    color=terceraFicha.getColor();
                }
            }
            for (int i = 1; i < lista.size(); i++) {
                if(lista.get(i).getColor()==color && lista.get(i).getNumero()!=0){
                    if (lista.get(i).getNumero()<lista.get(i-1).getNumero()&& lista.get(i).getNumero()-lista.get(i-1).getNumero()!=1) {                
                        return false;
                    }
                }else if(lista.get(i).getNumero()!=0){
                    return false;
                }
            }
        }
        return true;
    }
}
