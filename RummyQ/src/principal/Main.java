package principal;

import java.net.InetSocketAddress;
import servidor.Servidor;

/**
 *
 * @author Santiago Pérez
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        Servidor server = new Servidor(new InetSocketAddress(30001));
        server.start();
    }
    
}
