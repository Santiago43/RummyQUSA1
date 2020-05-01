$(document).ready(
	function(){
		crearRejilla(4);
	}
);

$( function() {
		$( ".empty.column" ).droppable({
				drop: function(event,ui){
					console.log(event);
					console.log(ui);
					console.log('estoyen'+event.target.id);

				}
			});
	} );

$( function() {
		$( ".fill" ).draggable({
				stop: function(event,ui){
					console.log("stop");
				//	console.log(event);
					console.log(ui);
				},
				 start:function(event,ui){
				 	console.log("start");
					console.log(event);
					console.log(ui);
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