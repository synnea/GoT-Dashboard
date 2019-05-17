
$(document).ready(function(){

	// On load, activate the animation on the main button.

    $("#winter-btn").addClass("flicker-in-1");

    // Hide all sections apart from the main one.

    $(function () {
        $(".gen-dash, .death-dash, .pop-dash, .chara-select").hide();
    });

    $(function() {
        $("#navGen").on("click", function(){
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
        
});