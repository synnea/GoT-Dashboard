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

        gotData.forEach(function(d){
            d.Season = String(d.Season);
        })

        show_num_eps(ndx);
        show_num_seasons(ndx);
        // show_viewers_per_season(ndx);

        dc.renderAll();

    

//----------------------NUMBER OF EPISODES FUNCTION -------------

    function show_num_eps(ndx) {

        var allData = ndx.groupAll();

        dc.dataCount("#numEps") 
            .crossfilter(ndx)
            .group(allData);

    }

//----------------------NUMBER OF SEASONS  FUNCTION -------------

    function show_num_seasons(ndx) {
        dim = ndx.dimension(dc.pluck('Season'));
        groupSeason = dim.group();

        dc.numberDisplay("#numSeasons")
            .group(groupSeason);
    }

    /*
//-------------------------VIEWERSHIP PER SEASON --------------

    function viewers_per_season(ndx) {
        seasonDimension = ndx.dimension(dc.pluck('Season'));

    }
    */

    }
})