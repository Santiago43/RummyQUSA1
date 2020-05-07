/**
* Promesa
* @param {*} ms 
*/
var wait = ms => new Promise((r, j) => setTimeout(r, ms));
/**
* Dirección con protocolo ws
*/
var wsUri = "ws://25.143.152.254:30001";
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
		else if(obj.tipo==="ficha robada"){
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
		else if(obj.tipo==="error"){
			alert(obj.mensaje);
		}
		else if(obj.tipo==="borrar ficha"){
			borrarFicha(obj.x,obj.y);
		}else if (obj.tipo==="ficha devuelta"){
			fichaDevuelta(obj.ficha,obj.idDiv);
		}
		else if(obj.tipo==="ficha no robada"){
			alert("No hay más fichas");
		}
		else if(obj.tipo==="jugada inválida"){
			alert("jugada inválida");
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


function eventosDraggable(){
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
				coords = $(posicion).attr("id");
				origen=$(variable[0]).attr("id");
			},
			revert:function(posicion){
				return !turno.valor;
			},
			revertDuration:550
		});
		$( ".empty.column" ).droppable({
			drop: function(event,ui){
				if(turno.valor){
					console.log("drop");
					var id = ui.draggable.attr('class');
					var datos = id.split(" ");
					var valorFicha = datos[1].split("-");
					console.log(valorFicha);
					$(ui.draggable).remove();
					if(origen==="manoJugador"){
						colocarFicha(event.target.id,valorFicha);
					}
					else if(origen ==="tablero"){
						moverFicha(event.target.id,valorFicha,coords);
					}
				}else{
					alert("Usted no está en turno para hacer esa jugada");
				}							
			}
		});
		$(".empty.espacioMano").droppable({
			drop: function(event,ui){
				var id = ui.draggable.attr('class');
				var datos = id.split(" ");
				var valorFicha = datos[1].split("-");
				console.log(valorFicha);
				console.log(origen);
				if(origen==="manoJugador"){
					$(ui.draggable).remove();
					acomodarFicha(event.target.id,valorFicha);
				}
				else if(origen ==="tablero"){
					if(turno.valor){
						$(ui.draggable).remove();
						devolverFicha(event.target.id,valorFicha,coords);
					}else{
						alert("Usted no está en turno");
					}
				}
			}
		})
		
	} );
}
/**
 * 
 * @param {*} idDiv 
 * @param {*} valorFicha 
 */
function acomodarFicha(idDiv,valorFicha){
	var color = valorFicha[0];
	var numero = valorFicha[1];
	var texto = '<div oncontextmenu="soni'+color+''+numero+'.play()" onmouseup="soltar.play()" class="fill '+color+'-'+numero+'" draggable="true"> <img src="img/fichas/'+color+'-'+numero+'.png" height="70px" width="43px" ></div>';
	$("#"+idDiv).append(texto);
	eventosDraggable();
}

/**
 * 
 * @param {*} idDiv 
 * @param {*} valorFicha 
 * @param {*} coordenadas 
 */
function devolverFicha(idDiv,valorFicha,coordenadas){
	var color = valorFicha[0];
	var numero = valorFicha[1];
	var coordenadasPrevias = coordenadas.split("-");
	var xAnterior = coordenadasPrevias[0];
	var yAnterior = coordenadasPrevias[1];
	var objeto ={
		tipo: "devolver ficha",
		ficha:{
			numero: numero,
			color: color,
			xAnterior: xAnterior,
			yAnterior: yAnterior
		},
		div:idDiv
	}
	enviarMensaje(objeto);

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
		fichas='<div oncontextmenu="soni'+mano[i].color+''+mano[i].numero+'.play()" onmouseup="soltar.play()" class="fill '+mano[i].color+'-'+mano[i].numero+'" draggable="true"> <img src="img/fichas/'+mano[i].color+'-'+mano[i].numero+'.png" height="70px" width="43px" ></div>';
		$("#"+i).append(fichas);
	}	
	for (let i = 0; i < nuevosJugadores.length; i++) {
		jugadores.push(nuevosJugadores[i]); 	
		texto='<div class="casillaJugador"><img src="img/'+(i+1)+'.png">'+nuevosJugadores[i].nombre+'</div>';	
		$("#jugadores").append(texto);
	}
	eventosDraggable();
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
	var color = ficha[0];
	var numero = ficha[1];
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
	var texto = '<div oncontextmenu="soni'+objeto.ficha.color+''+objeto.ficha.numero+'.play()" onmouseup="soltar.play()" class="fill '+objeto.ficha.color+'-'+objeto.ficha.numero+'" draggable="true"> <img src="img/fichas/'+objeto.ficha.color+'-'+objeto.ficha.numero+'.png" height="70px" width="43px" ></div>';
	$("#"+objeto.ficha.x+"-"+objeto.ficha.y).append(texto);
	eventosDraggable();
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
	var color = valorFicha[0];
	var numero = valorFicha[1];
	var objeto ={
		tipo: "jugada - colocar ficha",
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
	var texto = '<div oncontextmenu="soni'+objeto.ficha.color+''+objeto.ficha.numero+'.play()" onmouseup="soltar.play()" class="fill '+objeto.ficha.color+'-'+objeto.ficha.numero+'" draggable="true"> <img src="img/fichas/'+objeto.ficha.color+'-'+objeto.ficha.numero+'.png" height="70px" width="43px" ></div>';
	$("#"+objeto.ficha.x+"-"+objeto.ficha.y).append(texto);
	eventosDraggable();
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
			var texto = '<div oncontextmenu="soni'+ficha.color+''+ficha.numero+'.play()" onmouseup="soltar.play()" class="fill '+ficha.color+'-'+ficha.numero+'" draggable="true"> <img src="img/fichas/'+ficha.color+'-'+ficha.numero+'.png" height="70px" width="43px" ></div>';
			$("#"+i).append(texto);
			continuar=false;
			eventosDraggable();
			
		}else{
			i++;
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
	var texto = '<div oncontextmenu="soni'+ficha.color+''+ficha.numero+'.play()" onmouseup="soltar.play()" class="fill '+ficha.color+'-'+ficha.numero+'" draggable="true"> <img src="img/fichas/'+ficha.color+'-'+ficha.numero+'.png" height="70px" width="43px" ></div>';
	$("#"+ficha.x+"-"+ficha.y).append(texto);
	eventosDraggable();
}

/**
* @param {*} ficha
*/
function fichaMovida(ficha){
	$("#"+ficha.xAnterior+"-"+ficha.yAnterior).empty();
	var texto = '<div oncontextmenu="soni'+ficha.color+''+ficha.numero+'.play()" onmouseup="soltar.play()" class="fill '+ficha.color+'-'+ficha.numero+'" draggable="true"> <img src="img/fichas/'+ficha.color+'-'+ficha.numero+'.png" height="70px" width="43px" ></div>';
	$("#"+ficha.x+"-"+ficha.y).append(texto);
	eventosDraggable();
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function borrarFicha(x,y){
	$("#"+x+'-'+y).empty();
}

/**
 * 
 * @param {*} ficha 
 * @param {*} idDiv 
 */
function fichaDevuelta(ficha,idDiv){
	var texto = '<div oncontextmenu="soni'+ficha.color+''+ficha.numero+'.play()" onmouseup="soltar.play()" class="fill '+ficha.color+'-'+ficha.numero+'" draggable="true"> <img src="img/fichas/'+ficha.color+'-'+ficha.numero+'.png" height="70px" width="43px" ></div>';
	$("#"+idDiv).append(texto);
}