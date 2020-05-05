/**
 * Promesa
 * @param {*} ms 
 */
var wait = ms => new Promise((r, j) => setTimeout(r, ms));
/**
 * Dirección con protocolo ws
 */
var wsUri = "ws://localhost:30001";
/**
 * Websocket
 */
var websocket = new WebSocket(wsUri);
/**
 * Mano del jugador
 */
var mano= new Array();
/**
 * Lista de jugadores
 */
var jugadores = new Array();
/**
 * El turno
 */
var turno ={valor:false};
var posicion;
/**
 * El origen de una jugada
 */
var origen;
/**
 * id
 */
var coords;

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
		else if(obj.tipo==="robar ficha"){
			fichaRobada(obj.ficha);
		}
		else if(obj.tipo==="cambio turno"){
			cambiarTurno(obj.valor);
        }
        else if(obj.tipo==="colocar ficha"){
			fichaColocada(obj.ficha);
        }
        else if(obj.tipo==="mover ficha"){
			fichaMovida(obj.ficha);
        }
		else if(obj.tipo==="turno"){
			jugadorEnTurno(obj.jugador);
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
 		fichas='<div oncontextmenu="soni'+mano[i].color+''+mano[i].numero+'.play()" class="fill '+mano[i].color+'-'+mano[i].numero+'" draggable="true"> <img src="img/fichas/'+mano[i].color+'-'+mano[i].numero+'.png" height="70px" width="43px" ></div>';
 		$("#"+i).append(fichas);
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
                //console.log($(this).parent().parent());
				var variable = $(this).parent().parent().parent();
				posicion = $(this).parent();
				console.log(posicion);
				coords = $(variable[0]).attr("id");
				console.log($(variable[0]).attr("id"));
				origen=$(variable[0]).attr("id");
                console.log($(this).parent());
			},
			revert:function(posicion){
				console.log(nuev);
				return nuev;
			}
		});
		$( ".empty.column" ).droppable({
			drop: function(event,ui){
                
				ui.draggable.addClass("dropped");
				console.log("drop");
				$(this).append(ui.draggable);
				var id = ui.draggable.attr('class');
				var datos = id.split(" ");
				var valorFicha = datos[1].split("-");
				console.log(valorFicha);
				if(origen==="manoJugador"){
					colocarFicha(event.target.id,valorFicha);
				}
				else if(origen ==="tablero"){
					moverFicha(event.target.id,valorFicha,coords);
				}
                posicion = ui.draggable;
				
				console.log(id);
				/*
                var ficha = datos.split("-");
                
				if(true){
                    colocarFicha(event.target.id,ficha);
                }
				else{
                    var posicionAnterior; //La posible posición ;c
                    moverFicha(event.target.id,ficha,posicionAnterior);
                }*/
                    
                
				console.log(posicion);				
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
 * @param {*} idDiv es el div de la posición actual
 * @param {*} ficha ficha
 * @param {*} prev posición previa
 */
function moverFicha(idDiv,ficha,prev){
    var coordenadas = idDiv.split("-");
    var x = coordenadas[0];
    var y = coordenadas[1];
    var valor = ficha[1].split("-");
    var color = valor[0];
    var numero = valor[1];
	var coordenadasPrevias = prev.split("-");
	var xAnterior = coordenadasPrevias[0];
	var yAnterior = coordenadasPrevias[1];
	var objeto ={
		tipo: "jugada - mover ficha",
		ficha:{
			numero: numero,
			color: color,
			x: x,
			y: y,
			xAnterior: xAnterior,
			yAnterior: yAnterior
		}
	}
	enviarMensaje(objeto);
}

/**
 * Función que permite colocar una ficha
 * @param {*} idDiv que es el id del div donde está la ficha 
 * @param {*} valorFicha que es la ficha
 */
function colocarFicha(idDiv, valorFicha){
    var coordenadas = idDiv.split("-");
    var x = coordenadas[0];
    var y = coordenadas[1];
    var valor = valorFicha[1].split("-");
    var color = valor[0];
    var numero = valor[1];
    var objeto ={
        tipo: "colocar ficha",
        ficha: {
			x:x,
			y:y,
			color:color,
			numero:numero,
			xAnterior:-1,
			yAnterior:-1
		}
	}
	console.log(objeto);
    enviarMensaje(objeto);
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

/**
 * Función que envía al servidor el fin de un turno
 */
function terminarTurno(){
	var object ={
		tipo: "terminar turno"
	};
	enviarMensaje(object);
}

/**
 * Función que envía al servidor el robar una ficha
 */
function robarFicha(){
	var object = {
		tipo: "robar ficha"
	};
	enviarMensaje(object);
}

/**
 * Función que guarda la ficha robada de la banca
 * @param {Ficha} ficha que es la ficha robada
 */
function fichaRobada(ficha){
	mano.push(ficha);
	var continuar = true;
	var i=0;
	while(continuar){
		if($("#"+i).children().length == 0){
			var texto = '<div class="fill '+ficha.color+'-'+ficha.numero+'" draggable="true"> <img src="img/fichas/'+ficha.color+'-'+ficha.numero+'.png" height="70px" width="43px" ></div>';
			continuar=false;
		}
	}
}
/**
 * Función que modifica el valor del objeto que indica si está en turno o no
 * @param {boolean} valor el estado del turno (sí o no)
 */
function cambiarTurno(valor){
	turno.valor=valor;
}

/**
 * Función que muestra quién está en turno
 */
function jugadorEnTurno(jugador){
	alert("Turno de: "+jugador);
}

/**
 * 
 * @param {*} ficha 
 */
function fichaColocada(ficha){
    var texto = '<div oncontextmenu="soni'+ficha.color+''+ficha.numero+'.play()" class="fill '+ficha.color+'-'+ficha.numero+'" draggable="true"> <img src="img/fichas/'+ficha.color+'-'+ficha.numero+'.png" height="70px" width="43px" ></div>';
    $("#"+ficha.x+"-"+ficha.y).append(texto);
}

/**
 * @param {*} ficha
 */
function fichaMovida(ficha){
	$("#"+ficha.xAnterior+"-"+ficha.yAnterior).empty();
	var texto = '<div oncontextmenu="soni'+ficha.color+''+ficha.numero+'.play()" class="fill '+ficha.color+'-'+ficha.numero+'" draggable="true"> <img src="img/fichas/'+ficha.color+'-'+ficha.numero+'.png" height="70px" width="43px" ></div>';
    $("#"+ficha.x+"-"+ficha.y).append(texto);
}