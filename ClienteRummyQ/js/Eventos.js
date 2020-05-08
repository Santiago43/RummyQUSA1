$("#BtnCrearSala").click(function(){
	setCookie("nombre",$("#nombre").val(),1);
	crearSala();
});

$("#StartGame").click(function(){
	iniciarPartida();
});

$("#BtnUnirseASala").click(function(){
	setCookie("nombre",$("#nombre").val(),1);
	$("#DivUnirseASala").show();
	$("#DivInicio").hide();
});

$("#Unirse").click(function(){
	var nombre = getCookie("nombre");
	var codigo = $("#InputCodigo2").val();
	var imagen = "img/avatar/basico/1.png";
	for (let i = 1; i <= 5; i++) {
		if($("#r"+i).attr("checked")){
			imagen="img/avatar/futbol/"+i+".png";
		}
		
	}
	conectarASala(codigo,nombre,imagen);
})

$("#btnTerminarTurno").click(function(){
	terminarTurno();
});

$("#sonido").click(function(){
	if(sonido===true){
		sonido=false;
	}
	else{
		sonido=true;
	}
});

$("#aCrearToInicio").click(function(){
	desconectarDeSala();
	$("#DivCrearSala").hide();
	$("#DivInicio").show();
});

$("#aUnirseToInicio").click(function(){
	desconectarDeSala();
	$("#DivUnirseASala").hide();
	$("#DivInicio").show();
});

