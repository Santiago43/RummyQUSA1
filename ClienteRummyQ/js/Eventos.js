$("#BtnCrearSala").click(function(){
	setCookie("nombre",$("#nombre").val(),1);
	crearSala();
});

$("#StartGame").click(function(){
	iniciarPartida();
});

$("#UnirseASalarse").click(function(){
	setCookie("nombre",$("#nombre").val(),1);
});