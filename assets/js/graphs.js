queue()
    .defer(d3.json, "data/got_json.json")
    .await(makeGraphs);

function makeGraphs(error, gotData) {
    var ndx = crossfilter(gotData);

    // The following function enables the printing of crossfilter data. This function was used extensively to look inside crossfilter groups.

function print_filter(filter) {
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}


// Convert airdates to a valid date data type



gotData.forEach(function(d){
    var airDates = new Date(d.airdate);
    d.airdate = airDates;
});

    show_total_viewership_by_season(ndx);
    show_avg_viewership_by_season(ndx);
    show_num_eps(ndx);
    show_num_seasons(ndx);
    show_viewership_over_time(ndx);

    dc.renderAll();
}



// Individual Graph Functions

function show_total_viewership_by_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var total_viewership_per_season = seasonDim.group().reduceSum(dc.pluck('viewers'));

    dc.barChart('#viewsSeason')
        .width(500)
        .height(300)
        .margins({
            top: 10,
            right: 60,
            bottom: 30,
            left: 50
        })
        .dimension(seasonDim)
        .group(total_viewership_per_season)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .y(d3.scale.linear()
            .domain([0, 85]))
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Season")
        .yAxisLabel("Viewership (in millions)")
        .renderLabel(true)
        .yAxis().ticks(4);
}

function show_avg_viewership_by_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var avg_views_group = seasonDim.group().reduce(

        // Add a Fact
        function (p, v) {
            p.count++;
            p.total += v.viewers;
            p.average = p.total / p.count;
            return p;
        },
        // Remove a Fact
        function (p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            } else {
                p.total -= v.viewers;
                p.average = p.total / p.count;
            }
            return p;
        },
        // Initialise the Reducer
        function () {
            return {
                count: 0,
                total: 0,
                average: 0
            };
        }


    );

    dc.barChart('#avgViewsSeason')
        .width(500)
        .height(300)
        .margins({
            top: 10,
            right: 60,
            bottom: 30,
            left: 50
        })
        .dimension(seasonDim)
        .group(avg_views_group)
        .transitionDuration(500)
        .valueAccessor(function (d) {
            return d.value.average;
        })
        .x(d3.scale.ordinal())
        .y(d3.scale.linear()
            .domain([0, 15]))
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Season")
        .yAxisLabel("Viewership (in million)")
        .renderLabel(true)
        .yAxis().ticks(4);
}

function show_num_eps(ndx) {

    var numEpGroup = ndx.groupAll();

    dc.numberDisplay("#numEps")
        .group(numEpGroup)
        .valueAccessor(function (d) {
            return d;
    })
};

function show_num_seasons(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var numSeasonGroup = seasonDim.group();
   
    // this function, generated with the reductio.js library counts the number of unique seasons

        var reducer = reductio()
            .exception(function(d) { return d.season; })
            .exceptionCount(true)
        
        reducer(numSeasonGroup);

    dc.numberDisplay("#numSeasons")
        .group(numSeasonGroup)
        .formatNumber(d3.format(".1"))
        .valueAccessor(function (d) {
            return d.key;
    })
}

function show_viewership_over_time(ndx) {

    // Function that removes blank values so the line chart doesn't nosedive

    function remove_blanks(group, value_to_remove) {
        // Filter out specified values from passed group
        return {
            all: function() {
                return group.all().filter(function(d) {
                    return d.key !== value_to_remove;
                });
            }
        };
    }


    var dateDim = ndx.dimension(function (d) {return d.airdate; });

    var season1Views = dateDim.group().reduceSum(function(d) {
        if (d.season === 1) {
            return +d.viewers;
        } else {
            return 0;
        }
    });

    var season1Group = remove_blanks(season1Views, "");



    //var viewGroup = dateDim.group().reduceSum(dc.pluck('viewers'));

    var minDate = dateDim.bottom(1)[0].airdate;
    var maxDate = dateDim.top(1)[0].airdate;

    dc.lineChart('#viewsOverTime')
    .width(800)
    .height(400) 
    .margins({
        top: 10,
        right: 60,
        bottom: 30,
        left: 50
    })
    .dimension(dateDim)
    .group(season1Group)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate,maxDate]))
    .xUnits(d3.time.month)
    .y(d3.scale.linear()
        .domain([0, 20]))
    .xAxisLabel("Time")
    .yAxisLabel("Viewership (in million)")
    .yAxis().ticks(4);
}