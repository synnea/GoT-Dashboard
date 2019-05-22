$(document).ready(function () {

    // ------------------------------------- NAVBAR -------------------------------------

    // On load, activate the animation on the main button.

    $("#winter-btn").addClass("flicker-in-1").on("click", function () {
        $(".gen-dash, .death-dash, .pop-dash, .chara-select").hide();
        $(".main").fadeIn(500);
    });

    // Hide all sections apart from the main one.

    $(function () {
        $(".gen-dash, .death-dash, .pop-dash, .chara-select").hide();
    });

    // Upon clicking upon the first tab, hide the landing page and show the first dashboard.

    $(function () {
        $("#navGen").on("click", function () {
            $(".main").hide();
            $(".gen-dash").fadeIn(500);
        });
    });

    // The "Home" button takes the user back to the landing page.

    $(function () {
        $("#navHome").on("click", function () {
            $(".gen-dash, .death-dash, .pop-dash, .chara-select").hide();
            $(".main").fadeIn(500);
        });
    });

    // ------------------------------------ LANDING PAGE ---------------------------------------

    // The CTA button takes the user to the first dashboard.

    $(function () {
        $("#winter-btn").on("click", function () {
            $(".main").hide();
            $(".gen-dash").fadeIn(500);
        });
    });

    // ---------------------------------- GENERAL DASHBOARD ------------------------------------

    // the following queue function loads the data and holds back the graph making function until the loading has finished

    queue()
        .defer(d3.json, "data/got_json.json")
        .await(makeGraphs);

    function makeGraphs(error, gotData) {}

});