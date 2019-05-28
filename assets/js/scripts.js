$(document).ready(function () {

    // ------------------------------------- NAVBAR -------------------------------------

    // On load, activate the animation on the main button.

    $("#winter-btn").addClass("flicker-in-1").on("click", function () {
        $(".dashboard-container").hide();
        $(".main").fadeIn(500);
    });

    // Hide all sections apart from the main one.

    $(function () {
        $(".dashboard-container").hide();
    });

    // Upon clicking upon the first tab, hide the landing page and show the first dashboard.

    $(function () {
        $("#navGen").on("click", function () {
            $(".main").hide();
            $(".dashboard-container").fadeIn(500);
            $(".content-container").removeClass("background").addClass("background-alt");
        });
    });

    // The "Home" button takes the user back to the landing page.

    $(function () {
        $("#navHome").on("click", function () {
            $(".dashboard-container").hide();
            $(".main").fadeIn(500);
            $(".content-container").removeClass("background-alt").addClass("background");
        });
    });

    //Upon click the second tab, show the second part of the dashboard.

    $(function () {
        $("#navDeathLink").on("click", function () {
            $(".main").hide();
            $(".dashboard-container").fadeIn(500);
            $(".content-container").removeClass("background").addClass("background-alt");
        });
    });

    // ------------------------------------ LANDING PAGE ---------------------------------------

    // The CTA button takes the user to the first dashboard.

    $(function () {
        $("#winter-btn").on("click", function () {
            $(".main").hide();
            $(".dashboard-container").fadeIn(500);
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
               }, 900, 'swing', function () {
                window.location.hash = target;
               });
        });
    });

    // ------------------------------------ SMOOTH SCROLLING ---------------------------------------

    // A smooth animation takes the user to the desired dashboard

    $('a[href*="#"]').on('click',function(e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        $('html, body').stop().animate({
         'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
         window.location.hash = target;
        });
       });

});