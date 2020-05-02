var posicion="";
var nuev="";
$(document).ready(
	function(){
		crearRejilla(6,19);
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
			$(this).append(ui.draggable);
		}
	});

} );


function crearRejilla(filas,columnas){
	var texto="";
	for (let i = 0; i < filas; i++) {
		texto+="<div class='ficha row'>";
		for (let j = 0; j < columnas; j++) {
			texto+="<div id='"+j+"-"+i+"' class='empty'></div>";
		}
		texto+='</div>';
	}
	$("#tablero").append(texto);
}

//function consultar(posicion){
//	if(posicion!=null){
//		return false;
//	}else{
//		return true;
	//}
//}