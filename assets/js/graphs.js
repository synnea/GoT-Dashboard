    // ---------------------------------- GENERAL DASHBOARD ------------------------------------

// jQuery (load scripts once page loads)
$(document).ready(function () {




    // -------------------- LOAD DATA --------------------
    // queue.js is no longer supported for newer versions of dc|d3. Instead a 'promise' is made:

    d3.json("data/got_json.json").then(chartBuilder);


    // -------------------- COLORS --------------------
    // DC.js has new color schemes as of 2018: https://github.com/d3/d3-scale-chromatic
    // to set a default color scheme for all charts: (replace SCHEME with choice)
    // dc.config.defaultColors(d3.SCHEME);
    dc.config.defaultColors(d3.schemeSpectral[11]);

    function chartBuilder(gotData) {

        var ndx = crossfilter(gotData);
        var allData = ndx.groupAll(); // allData groups all 'ndx' items for the ??DATACOUNT??

        console.log(ndx);

    }

})