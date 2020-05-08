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
	var imagen = "img/avatar/futbol/1.png";
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

$("#r1").click(function(){
	$(".avatar").attr("checked",false);
	$("#r1").attr("checked",true);
});
$("#r2").click(function(){
	$(".avatar").attr("checked",false);
	$("#r2").attr("checked",true);
});
$("#r3").click(function(){
	$(".avatar").attr("checked",false);
	$("#r3").attr("checked",true);
});
$("#r4").click(function(){
	$(".avatar").attr("checked",false);
	$("#r4").attr("checked",true);
});
$("#r5").click(function(){
	$(".avatar").attr("checked",false);
	$("#r5").attr("checked",true);
});
