var posicion="";
var nuev="";
$(document).ready(
	function(){
		crearRejilla(5);
	}
	);

//$( function() {
//	$( ".empty.column" ).droppable({
//		drop: function(event,ui){
//			console.log(event);
//			console.log(ui);
//			console.log('estoyen'+event.target.id);
//		}
//	});
//} );

$( function() {
	$( ".fill" ).draggable({
		stop: function(event,ui){
			console.log("stop");
				//	console.log(event);
				//console.log(ui);
				//nuev=consultar(posicion);	
				//console.log(posicion);
			},
			start:function(event,ui){
				console.log("start");
				//console.log(event);
				//console.log(ui);
			},
			revert:function(posicion){
				console.log(nuev);
				return nuev;
			},
		});
	$( ".empty.column" ).droppable({
		drop: function(event,ui){
			//console.log(event);
			//console.log(ui);
			//console.log('estoyen'+event.target.id);
			//posicion=event.target.id;
			  ui.draggable.addClass("dropped");
            $(this).append(ui.draggable);
		}
	});

} );


function crearRejilla(filas){
	var texto="";
	for (let i = 0; i < filas; i++) {
		texto+="<div class='row'>";
		for (let j = 0; j < 12; j++) {
			texto+="<div id='"+j+"-"+i+"' class='empty column'></div>";
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