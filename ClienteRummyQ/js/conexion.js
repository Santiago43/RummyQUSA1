var wait = ms => new Promise((r, j) => setTimeout(r, ms));
var wsUri = "ws://localhost:30001";
var websocket = new WebSocket(wsUri);
var mano= new Array();
var jugadores = new Array();

/**
* Cuando se abre la conexión
*/
websocket.onopen = function(event){
	console.log("Conectado..."); //... y aparecerá en la pantalla
	ping();
	
}
/**
* Cuando el servidor envía un mensaje
*/
websocket.onmessage=function(event){
	
	if (event.data === "pong") {
		ping();
	} else {
		var obj = JSON.parse(event.data);
		if(obj.tipo==="hash"){
			//Se recibe el hash y se guarda en una cookie. 
			setCookie("hash",obj.hash,1);
		}
		else if (obj.tipo==="codigo sala"){
			//Se recibe el código de la sala y un mensaje 
			cambiarASalaDeEsperaCreador(obj.codigo,obj.mensaje,1);
		}
		else if(obj.tipo==="conexion sala"){
			if(obj.mensaje==="conectado"){
				//Se recibe el código de la sala, un mensaje y los participantes que están
				cambiarASalaDeEspera(obj.codigo,obj.mensaje,obj.participantes);
			}
			else{
				//Indica que la conexión a la sala fue errónea
				alert(obj.mensaje);
			}
		}
		else if(obj.tipo==="nuevo jugador"){
			//Se conectó un nuevo jugador
			console.log("nuevo conectado");
			añadirParticipante(obj.participantes);
		}
		else if(obj.tipo==="nueva mano"){
			cambiarAlTablero(obj.mano,obj.jugadores)
		}
		else if(obj.tipo==="ganador"){
			terminarJuego(obj.ganador);
		}
	}
}

/**
* Cuando el websocket se cierra
*/
websocket.onclose=function(event){
	console.log("conexión terminada");
}

/**
* Cuando el websocket presenta un error
*/
websocket.onerror=function(event){
	alert("Error de conexión "+event.data);
}

/**
* Pong
*/
function ping(){
	myPing = {tipo: "ping",message: "heartbeating"};
	var prom = wait(28000)  // prom, is a promise
	var showdone = () => enviarMensaje(myPing);
	prom.then(showdone)
}


/**
* Función que envía un mensaje al servidor
*/

function enviarMensaje(object){
	var stringObject = JSON.stringify(object);
	websocket.send(stringObject);
	console.log("Enviando: "+stringObject);
}


/**
 * Aquí comienzan las funciones de SALA
 * 
 * Todas las funciones acá abajo representan cada una de las operaciones
 * que se pueden realizar desde el cliente hacia el servidor
 * 
 */


/**
* Crear sala
*/
function crearSala(){
	var object ={tipo: "crear sala", usuario: getCookie("nombre")};
	enviarMensaje(object);
	/**
	 * Luego se debe colocar el cambio al tablero de este usuario, lo cual 
	 * se da en una noficiación del servidor
	 */
	}
/**
 * Función que permite conectarse a una sala
 */
 function conectarASala(codigo,usuario){
 	var object= {tipo: "conectarse a sala", codigo: codigo,usuario: usuario};
 	enviarMensaje(object);
 }

/**
 * Función que agrega participantes a la sala
 * @param {number} participantes que es el número nuevo de participantes
 */
 function añadirParticipante(participantes){
	$("#noParticipantes").empty();
 	$("#ParticipantesInvitados").empty();
 	$("#noParticipantes").append("Participantes: "+participantes);
 	$("#ParticipantesInvitados").append("Participantes: "+participantes);

 }

/**
 * Función que permite conectarse a la sala de espera. 
 * La misma puede es invocada desde una respuesta del servidor
 * @param {number} codigo que es el código de la sala
 * @param {String} mensaje que es un mensaje del servidor
 * @param {number} participantes que son los participantes activos en ese momento
 */
 function cambiarASalaDeEsperaCreador(codigo,mensaje,participantes){
 	$("#DivCrearSala").show();
 	$("#DivInicio").hide();
 	$("#InputCodigo").attr("value",codigo);
 	console.log(mensaje);
 	$("#noParticipantes").append(participantes);
 }


 function cambiarASalaDeEspera(codigo,mensaje,participantes){
 	$("#DivInformacionSala").show();
 	$("#DivBotonUnirse").hide();
 	$("#InputCodigo2").attr("value",codigo);
 	console.log(mensaje);
 	$("#ParticipantesInvitados").append(participantes);
 }

/**
* Función que permite iniciar la partida
*/
function iniciarPartida(){
	var object = {tipo: "iniciar partida"};
	enviarMensaje(object);
}

/**
 * Función que permite cambiar al tablero
 * @param {*} nuevaMano que es el arreglo con la mano del jugador 
 */
 function cambiarAlTablero(nuevaMano,nuevosJugadores){
 	$("#DivInicio").hide();
 	$("#DivCrearSala").hide();
 	$("#DivUnirseASala").hide();
 	$("#DivInformacionSala").hide();
 	$("#gridTablero").show();		

 	var texto="";
 	var fichas="";
 	for (let i = 0; i < nuevaMano.length; i++) {
 		mano.push(nuevaMano[i]);
<<<<<<< HEAD
 		fichas='<div class="fill" draggable="true"> <img src="img/fichas/'+mano[i].color+'-'+mano[i].numero +'.png height="70px" width="43px" ></div>';
 		$("#"+i+"").append(fichas);
=======
 		fichas='<div class="fill" draggable="true"> <img src="img/fichas/'+mano[i].color+'-'+mano[i].numero+'.png" height="70px" width="43px" ></div>';
 		$("#"+i).append(fichas);
>>>>>>> master
 	}	
 	for (let i = 0; i < nuevosJugadores.length; i++) {
 		jugadores.push(nuevosJugadores[i]); 	
		texto='<div class="casillaJugador"><img src="img/'+(i+1)+'.png">'+nuevosJugadores[i].nombre+'</div>';	
		$("#jugadores").append(texto);
	 }
	 $( function() {
		$( ".fill" ).draggable({
			stop: function(event,ui){
				console.log("stop");
			},
			start:function(event,ui){
				console.log("start");
			},
			revert:function(posicion){
				console.log(nuev);
				return nuev;
			}
		});
		$( ".empty.column" ).droppable({
			drop: function(event,ui){
				//console.log('estoyen'+event.target.id);
				//posicion=event.target.id;
				ui.draggable.addClass("dropped");
				console.log("drop");
				$(this).append(ui.draggable);
			}
		});
		$(".empty.espacioMano").droppable({
			drop: function(event,ui){
				
			}
		})
	
	} );
	//Luego irán las instrucciones necesarias para hacer el cambio de la página al tablero
}


/**
 * A continuación, las funciones que representan jugadas del cliente. 
 * Estas permiten lograr la sincronización con el servidor y las jugadas que realiza
 * este y los demás clientes.
 */


/**
* Función que permite mover una ficha
*/
function moverFicha(){
	
}

/**
* Función que permite colocar una ficha
*/
function colocarFicha(){
	
}


/**
 * Función que permite terminar la partida. El jugador es retornado a la 
 * Vista por la que entro
 * @param {*} ganador que es el nombre de quien ganó la partida
 */

 function terminarJuego(ganador){
 	alert("El juego terminó. El ganador es: "+ganador);
	//Luego se devuelve a la vista anterior 
	$("#DivInicio").show();
	$("#gridTablero").empty();
}