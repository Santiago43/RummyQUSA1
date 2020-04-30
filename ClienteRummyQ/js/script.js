$(document).ready(
	function(){
		crearRejilla(4);
	}
);

/*$( function() {
		$( ".m" ).draggable();
	} );
*/
function crearRejilla(filas){
	var texto="";
	for (let i = 0; i < filas; i++) {
		texto+="<div class='row'>";
		for (let j = 0; j < 12; j++) {
			texto+="<div class='empty col-lg-1'></div>";
		}
		texto+='</div>';
	}
	$("#tablero").append(texto);
}