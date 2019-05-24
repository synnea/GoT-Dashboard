queue()
    .defer(d3.json, "data/got_json.json")
    .await(makeGraphs);
    
function makeGraphs(error, gotData) {
    var ndx = crossfilter(gotData);
    
    show_total_viewership_by_season(ndx);
    show_avg_viewership_by_season(ndx);
    
    dc.renderAll();
}
    // Individual Graph Functions

function show_total_viewership_by_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var total_viewership_per_season = seasonDim.group().reduceSum(dc.pluck('viewers'));

    dc.barChart('#viewsSeason')
        .width(500)
        .height(300)
        .margins({top: 10, right: 60, bottom: 30, left: 50})
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
        function(p, v) {
            p.count++;
            p.total += v.viewers;
            p.average = p.total / p.count;
            return p;
        },
        // Remove a Fact
        function(p, v) {
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
            return { count: 0, total: 0, average: 0};
        }
        
        
        );
 
    dc.barChart('#avgViewsSeason')
        .width(500)
        .height(300)
        .margins({top: 10, right: 60, bottom: 30, left: 50})
        .dimension(seasonDim)
        .group(avg_views_group)
        .transitionDuration(500)
        .valueAccessor(function(d) {
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
 
 