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
    show_season_selector(ndx);

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

function show_season_selector(ndx) {
    var seasonDim = ndx.dimension(dc.pluck('season'));
    var seasonGroup = seasonDim.group();
    
    dc.selectMenu("#seasonSelector")
        .dimension(seasonDim)
        .group(seasonGroup)
        .promptText('Season Selector')
        .title(function (d){
            return 'Season ' + d.key + ': ' + d.value + ' Episodes';
        });
}


function show_viewership_over_time(ndx) {

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

   

    function views_by_season(season) {
        return function (d) {
        if (d.season === season) {
            return +d.viewers;
        }else {
            return 0;
    }
}
};

    var dateDim = ndx.dimension(function (d) {return d.airdate; });

    var minDate = dateDim.bottom(1)[0].airdate;
    var maxDate = dateDim.top(1)[0].airdate;


var S1Views = dateDim.group().reduceSum(views_by_season(1));
var S2Views = dateDim.group().reduceSum(views_by_season(2));
var S3Views = dateDim.group().reduceSum(views_by_season(3));
var S4Views = dateDim.group().reduceSum(views_by_season(4));
var S5Views = dateDim.group().reduceSum(views_by_season(5));
var S6Views = dateDim.group().reduceSum(views_by_season(6));
var S7Views = dateDim.group().reduceSum(views_by_season(7));
var S8Views = dateDim.group().reduceSum(views_by_season(8));

S1Group = remove_blanks(S1Views, 0);
S2Group = remove_blanks(S2Views, 0);
S3Group = remove_blanks(S3Views, 0);
S4Group = remove_blanks(S4Views, 0);
S5Group = remove_blanks(S5Views, 0);
S6Group = remove_blanks(S6Views, 0);
S7Group = remove_blanks(S7Views, 0);
S8Group = remove_blanks(S8Views, 0);

var compositeChart = dc.compositeChart('#viewsOverTime');
compositeChart
    .width(1200)
    .height(500)
    .dimension(dateDim)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxisLabel("Time")
    .yAxisLabel("Viewership (in million)")
    .renderHorizontalGridLines(true)
    .mouseZoomable(true)
    .compose([
        dc.lineChart(compositeChart)
            .group(S1Group, 'Season 1')
            .colors('green'),
        dc.lineChart(compositeChart)
            .colors('red')
            .group(S2Group, 'Season 2'),
            dc.lineChart(compositeChart)
            .colors('blue')
            .group(S3Group, 'Season 3'),
            dc.lineChart(compositeChart)
            .colors('black')
            .group(S4Group, 'Season 4'),
            dc.lineChart(compositeChart)
            .colors('yellow')
            .group(S5Group, 'Season 5'),
            dc.lineChart(compositeChart)
            .colors('orange')
            .group(S6Group, 'Season 6'),
            dc.lineChart(compositeChart)
            .colors('grey')
            .group(S7Group, 'Season 7'),
            dc.lineChart(compositeChart)
            .group(S8Group, 'Season 8'),
    ])
    .brushOn(true)
    .render();
}
