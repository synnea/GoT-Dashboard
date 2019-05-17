
$(document).ready(function(){

    // ------------------------------------- NAVBAR -------------------------------------

	// On load, activate the animation on the main button.

    $("#winter-btn").addClass("flicker-in-1").on("click", function(){
        $(".gen-dash, .death-dash, .pop-dash, .chara-select").hide();
        $(".main").fadeIn(500);
    });

    // Hide all sections apart from the main one.

    $(function () {
        $(".gen-dash, .death-dash, .pop-dash, .chara-select").hide();
    });

    $(function() {
        $("#navGen").on("click", function(){
            $("#navGenLink").css('color','#7FB7BE');
            $(".main").hide();
            $(".gen-dash").fadeIn(500);
        });
    });

    $(function() {
        $("#navHome").on("click", function(){
            $(".gen-dash, .death-dash, .pop-dash, .chara-select").hide();
            $(".main").fadeIn(500);
        });
    });

    $(function() {
        $("#winter-btn").on("click", function(){
            $(".main").hide();
            $(".gen-dash").fadeIn(500);
        });
    });
              
});