package funciones;

import java.util.LinkedList;
import java.util.Random;
import modelo.Ficha;

/**
 * Clase que genera fichas
 *
 * @author Valeria Bermúdez - Santiago Gutiérrez -Santiago Pérez
 * @since 2020-04-25
 * @version 0.0.1
 */
public class Generador {

    private static LinkedList<Ficha> fichas;

    /**
     *
     * @return
     */
    public static LinkedList crearFichas() {
        LinkedList<Ficha> fichas = new LinkedList();
        cicloNumeros:
        for (int i = 0; i < 13; i++) {
            /*
                0-negro
                1-rojo
                2-azul
                3-amarillo
             */
            fichasDobles:
            for (int k = 0; k < 2; k++) {

                cicloColores:
                for (int j = 0; j < 4; j++) {
                    Ficha ficha = new Ficha();
                    ficha.setNumero(i + 1);
                    ficha.setColor(j);
                    fichas.add(ficha);
                }
            }
        }
        Ficha comodin1 = new Ficha();
        Ficha comodin2 = new Ficha();
        comodin1.setColor(0);
        comodin2.setColor(1);
        comodin1.setNumero(0);
        comodin2.setNumero(0);
        fichas.add(comodin1);
        fichas.add(comodin2);
        return fichas;
    }

    /**
     *
     * @return
     */
    public static int generarNumeroSala() {
        return new Random((int) (Math.random() * (9000) + 1000)).nextInt();
    }

    public static LinkedList<Ficha> solicitarFichas() {
        if (fichas == null) {
            fichas = crearFichas();
        }
        return fichas;
    }

    public static LinkedList<Ficha> revolverFichas() {
        LinkedList<Ficha> nuevaLista = new LinkedList();
        LinkedList<Ficha> fichasRevueltas = new LinkedList();

        fichas.forEach((ficha) -> {
            nuevaLista.add(ficha);
        });
        while (nuevaLista.size() > 0) {
            fichasRevueltas.add(nuevaLista.remove((int) ((Math.random()) * nuevaLista.size())));
        }
        return fichasRevueltas;
    }
}
