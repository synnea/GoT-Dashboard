queue()
    .defer(d3.json, "data/got_json.json")
    .await(makeGraphs);

function makeGraphs(error, gotData) {
    var ndx = crossfilter(gotData);
    var seasonDim = ndx.dimension(dc.pluck('season'));

    show_total_viewership_by_season(ndx);
    show_avg_viewership_by_season(ndx);
    show_num_eps(ndx);
    show_num_seasons(ndx);

    dc.renderAll();
}

// The following function enables the printing of crossfilter data. This function was used extensively to look inside crossfilter groups.

function print_filter(filter) {
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
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