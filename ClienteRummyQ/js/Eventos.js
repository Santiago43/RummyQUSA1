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