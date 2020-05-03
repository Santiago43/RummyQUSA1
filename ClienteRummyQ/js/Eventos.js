$("#BtnCrearSala").click(function(){
	setCookie("nombre",$("#nombre").val());
	crearSala();
});

$("#StartGame").click(function(){
	iniciarPartida();
});

$("#BtnUnirseASala").click(function(){
	setCookie("nombre",$("#nombre").val());
});