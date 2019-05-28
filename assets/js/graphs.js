queue()
    .defer(d3.json, "data/got_json.json")
    .defer(d3.json, "data/got_monthly.json")
    .await(makeGraphs);

function makeGraphs(error, gotData, gotMonData) {
    var ndx = crossfilter(gotData);
    var ndx_monthly = crossfilter(gotMonData);

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

gotMonData.forEach(function(d){
    var airDates = new Date(d.airdate);
    d.airdate = airDates;
});


    show_total_viewership_by_season(ndx);
    show_avg_viewership_by_season(ndx);
    show_num_eps(ndx);
    show_num_seasons(ndx);
    show_viewership_over_time(ndx_monthly);

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

function show_viewership_over_time(ndx_monthly) {

    // Function that removes blank values so the line chart doesn't nosedive

    function remove_blanks(group, value_to_remove) {
        // Filter out specified values from passed group
        return {
            all: function() {
                return group.all().filter(function(d) {
                    return d.value !== value_to_remove;
                });
            }
        };
    }


    var dateDim = ndx_monthly.dimension(function (d) {return d.airdate; });

    function views_by_season(season) {
        if (d.season === season) {
            return +d.viewers;
        }else {
            return 0;
    }
    
};



var S1Views = dateDim.group().views_by_season(1);
var S2Views = dateDim.group().views_by_season(2);
var S3Views = dateDim.group().views_by_season(3);
var S4Views = dateDim.group().views_by_season(4);
var S5Views = dateDim.group().views_by_season(5);
var S6Views = dateDim.group().views_by_season(6);
var S7Views = dateDim.group().views_by_season(7);
var S8Views = dateDim.group().views_by_season(8);

var compositeChart = dc.compositeChart('#viewsOverTime');
compositeChart
    .width(990)
    .height(500)
    .dimension(dateDim)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxisLabel("Time")
    .yAxisLabel("Viewership (in million)")
    .renderHorizontalGridLines(true)
    .compose([
        dc.lineChart(compositeChart)
            .group(S1Views, 'Season 1'),
        dc.lineChart(compositeChart)
            .group(S2Views, 'Season 2'),
            dc.lineChart(compositeChart)
            .group(S3Views, 'Season 3'),
            dc.lineChart(compositeChart)
            .group(S4Views, 'Season 4'),
            dc.lineChart(compositeChart)
            .group(S5Views, 'Season 5'),
            dc.lineChart(compositeChart)
            .group(S6Views, 'Season 6'),
            dc.lineChart(compositeChart)
            .group(S7Views, 'Season 7'),
            dc.lineChart(compositeChart)
            .group(S8Views, 'Season 8'),
    ])
    .brushOn(false)
    .render();
}
