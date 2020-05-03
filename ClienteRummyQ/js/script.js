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