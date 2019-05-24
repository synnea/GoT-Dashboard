queue()
    .defer(d3.json, "data/got_json.json")
    .await(makeGraphs);
    
function makeGraphs(error, gotData) {
    var ndx = crossfilter(gotData);
    
    
    show_viewership_by_season(ndx);
    
    dc.renderAll();
}


function show_viewership_by_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('Season'));
    var viewership_per_season = seasonDim.group().reduceSum(dc.pluck('US viewers (million)'));

    dc.barChart('#viewsSeason')
        .width(500)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(seasonDim)
        .group(viewership_per_season)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Season")
        .yAxisLabel("Viewership (in million)")
        .yAxis().ticks(4);
}