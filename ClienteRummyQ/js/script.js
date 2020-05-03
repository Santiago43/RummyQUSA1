var posicion="";
var nuev="";
$(document).ready(
	function(){
		crearRejilla(7,19);
		$("#DivInicio").show();
		$("#DivCrearSala").hide();
		$("#DivUnirseASala").hide();
		$("#DivInformacionSala").hide();
		$("#gridTablero").hide();
	}
	);

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
		},
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


function crearRejilla(filas,columnas){
	var texto="";
	for (let i = 0; i < filas; i++) {
		texto+="<div class='ficha row'>";
		for (let j = 0; j < columnas; j++) {
			texto+="<div id='"+j+"-"+i+"' class='empty column'></div>";
		}
		texto+='</div>';
	}
	texto+='<div id="manoJugador"> '+crearEspaciosMano(16)+'</div>';
	$("#tablero").append(texto);
}

function crearEspaciosMano(columnas){
	var texto="";
	var numero=0;
	var fichas="";
	for (let i = 0; i <2; i++) {
		texto+="<div class='ficha row'>";
		for (var j = 0; j <columnas; j++) {
			texto+="<div id='"+numero+"' class='empty espacioMano'></div>";
			numero++;
		}
		texto+='</div>';
	}
	return texto;

}



//function consultar(posicion){
//	if(posicion!=null){
//		return false;
//	}else{
//		return true;
	//}
//}