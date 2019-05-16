
$(document).ready(function(){
    $("#jumbo").on("mouseenter", function() {
        $(this).removeClass("jumbotron-style").addClass("alt-jumbotron");
        });
        
    $("#jumbo").on("mouseleave", function() {
        $(this).removeClass("alt-jumbotron").addClass("jumbotron-style");
        });
        
});