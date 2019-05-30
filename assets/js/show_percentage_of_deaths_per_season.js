function show_percentage_of_deaths_per_season() {
    var seasonDim = ndx.dimension(dc.pluck('season'));
    var deathGroup = seasonDim.group().reduceSum(dc.pluck('deaths'));
}
