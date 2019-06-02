queue()
    .defer(d3.json, "data/got_json.json")
    .await(remove_blanks)
    .await(show_slice_percent)
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
    show_num_deaths(ndx);
    show_number_of_deaths_per_season(ndx);
    show_percentage_of_deaths_per_season(ndx);
    show_deaths_over_time(ndx);
    show_top_deathly_episodes(ndx);
    show_deathly_writers(ndx);
    show_avg_score(ndx);
    show_avg_score_per_season(ndx);
    show_top_rated_episodes(ndx);
    show_score_by_writer(ndx);
    

    dc.renderAll();
}

// ----------------- HELPER FUNCTION ----------------------

//  Function that removes blank values so the line chart doesn't nosedive

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

function show_slice_percent(key, endAngle, startAngle) {
    // Return the % of each pie slice as a string to be displayed
    // on the slice itself.
    // To save space, %'s below 9% display only the % and no other text.
    var percent = dc.utils.printSingleValue((endAngle - startAngle) / (2 * Math.PI) * 100);
    if (percent > 9) {
        return key + ' | ' + Math.round(percent) + '%';
    }
    else if (percent > 0) {
        return Math.round(percent) + '%';
    }
}
// ------------------ INDIVIDUAL GRAPH FUNCTIONS ----------------

function show_total_viewership_by_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var total_viewership_per_season = seasonDim.group().reduceSum(dc.pluck('viewers'));
    var barchartTotalViews = dc.barChart('#viewsSeason');




    barchartTotalViews
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
        .title(function (d){
            return 'Season ' + d.key + ' had a total of ' + d.value + ' million viewers';
        })
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
        .title(function (d){
            return 'Season ' + d.key + ' had an average of ' + d.value + ' million viewers';
        })
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

        dc.selectMenu("#seasonSelector-deaths")
        .dimension(seasonDim)
        .group(seasonGroup)
        .promptText('Season Selector')
        .title(function (d){
            return 'Season ' + d.key + ': ' + d.value + ' Episodes';
        });
}


function show_viewership_over_time(ndx) {


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
    .width(1000)
    .height(400)
    .dimension(dateDim)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxisLabel("Time")
    .yAxisLabel("Viewership (in million)")
    .renderHorizontalGridLines(true)
    .mouseZoomable(true)
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
    .compose([
        dc.lineChart(compositeChart)
            .group(S1Group, 'Season 1')
            .colors('#6c6cff'),
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
            .colors('indigo')
            .group(S5Group, 'Season 5'),
            dc.lineChart(compositeChart)
            .colors('orange')
            .group(S6Group, 'Season 6'),
            dc.lineChart(compositeChart)
            .colors('grey')
            .group(S7Group, 'Season 7'),
            dc.lineChart(compositeChart)
            .colors('172A3A')
            .group(S8Group, 'Season 8'),
    ])
    .brushOn(true)
    .elasticX(true)
    .render();
}

function show_num_deaths(ndx) {

    deathDim = ndx.dimension(dc.pluck('deaths'));
    deathGroup = deathDim.groupAll().reduceSum(dc.pluck('deaths'));

    dc.numberDisplay("#numDeaths")
        .group(deathGroup)
        .valueAccessor(function (d) {
            return d;
    })
}

function show_number_of_deaths_per_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var num_death_group = seasonDim.group().reduceSum(dc.pluck('deaths'));

    dc.barChart('#numDeathsSeason')
    .width(500)
    .height(300)
    .margins({
        top: 10,
        right: 60,
        bottom: 30,
        left: 50
    })
    .dimension(seasonDim)
    .group(num_death_group)
    .title(function (d){
        return 'Season ' + d.key + ' had an total of ' + d.value + ' notable deaths';
    })
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .y(d3.scale.linear()
        .domain([0, 50]))
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Season")
    .yAxisLabel("Deaths")
    .renderLabel(true)
    .yAxis().ticks(4);
}


function show_deaths_over_time(ndx) {

    var dateDim = ndx.dimension(function (d) {return d.airdate; });
    
    function deaths_by_season(season) {
        return function (d) {
        if (d.season === season) {
            return +d.deaths;
        }else {
            return 0;
    }
}
};

    var minDate = dateDim.bottom(1)[0].airdate;
    var maxDate = dateDim.top(1)[0].airdate;

 var S1Deaths = dateDim.group().reduceSum(deaths_by_season(1));
var S2Deaths = dateDim.group().reduceSum(deaths_by_season(2));
var S3Deaths = dateDim.group().reduceSum(deaths_by_season(3));
var S4Deaths = dateDim.group().reduceSum(deaths_by_season(4));
var S5Deaths = dateDim.group().reduceSum(deaths_by_season(5));
var S6Deaths = dateDim.group().reduceSum(deaths_by_season(6));
var S7Deaths = dateDim.group().reduceSum(deaths_by_season(7));
var S8Deaths = dateDim.group().reduceSum(deaths_by_season(8));

S1Group = remove_blanks(S1Deaths, 0);
S2Group = remove_blanks(S2Deaths, 0);
S3Group = remove_blanks(S3Deaths, 0);
S4Group = remove_blanks(S4Deaths, 0);
S5Group = remove_blanks(S5Deaths, 0);
S6Group = remove_blanks(S6Deaths, 0);
S7Group = remove_blanks(S7Deaths, 0);
S8Group = remove_blanks(S8Deaths, 0);

var compositeChart = dc.compositeChart('#deathsOverTime');
compositeChart
    .width(1000)
    .height(400)
    .dimension(dateDim)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxisLabel("Time")
    .yAxisLabel("Deaths")
    .renderHorizontalGridLines(true)
    .mouseZoomable(true)
    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
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
            .colors('indigo')
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
    .elasticX(true)
    .render();
}

function show_percentage_of_deaths_per_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var num_death_group = seasonDim.group().reduceSum(dc.pluck('deaths'));

    var seasonColors = d3.scale.ordinal()
    .range(['#6c6cff', 'blue', 'red','black', 'indigo', 'orange', 'grey', '#172A3A']);

    dc.pieChart("#deathPercentage")
    .height(300)
    .width(400)
    .radius(100)
    .transitionDuration(500)
    .drawPaths(true)
    .externalLabels(40)
    .title(function (d){
        return 'Season ' + d.key + ' accounted for approximately ' +   (d.value/230*100) + "% of total deaths"
    })
    .colorAccessor(function(d) {
        return d.key;
    })
    .colors(seasonColors)
    .dimension(seasonDim)
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return 'Season ' + show_slice_percent(d.data.key, d.endAngle, d.startAngle);
        });
    })
    .group(num_death_group);
}

function show_top_deathly_episodes(ndx) {
    
    var episodeDim = ndx.dimension(dc.pluck('episode'));
    var deathGroup = episodeDim.group().reduceSum(dc.pluck('deaths'));

    dc.rowChart("#topDeathlyEps")
        .dimension(episodeDim)
        .group(deathGroup)
        .width(500)
        .height(300)
        .margins({
            top: 10,
            right: 60,
            bottom: 30,
            left: 20
        })
        .title(function (d){
            return 'Episode ' + d.key[3] + d.key[4] + ' of Season ' + d.key[1] + ' killed ' + d.value + ' notable characters';
        })
        .transitionDuration(500)
         // exclude the 'Others' category in the row chart.
        .othersGrouper(false)
        .cap(10);

}

function show_deathly_writers(ndx) {

    var writerDim = ndx.dimension(dc.pluck('writer'));
    var deathGroup = writerDim.group().reduceSum(dc.pluck('deaths'));

    dc.pieChart("#topDeathlyWriters")
    .height(320)
    .width(400)
    .radius(80)
    .transitionDuration(500)
    .dimension(writerDim)
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return show_slice_percent(d.data.key, d.endAngle, d.startAngle);
        });
    })
  
    .group(deathGroup)
    .minAngleForLabel(0)
    .drawPaths(true)
    .othersGrouper(false)
    .externalLabels(30)
    .cap(4);
}

function show_avg_score(ndx) {

    var ratingDim = ndx.dimension(dc.pluck('rating'));
    var avgScore = ratingDim.groupAll().reduce(

        // Add a Fact
        function (p, v) {
            p.count++;
            p.total += v.rating;
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
                p.total -= v.rating;
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

    
        dc.numberDisplay("#avgIMDB")
            .group(avgScore)
            .valueAccessor(function (d) {
                return d.average;
        })

}

function  show_avg_score_per_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var avg_ratings_group = seasonDim.group().reduce(

        // Add a Fact
        function (p, v) {
            p.count++;
            p.total += v.rating;
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
                p.total -= v.rating;
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


    dc.barChart('#avgIMDBSeason')
        .width(500)
        .height(350)
        .margins({
            top: 10,
            right: 60,
            bottom: 30,
            left: 50
        })
        .dimension(seasonDim)
        .group(avg_ratings_group)
        .title(function (d){
            return 'Season ' + d.key + ' had an average ' + d.value + ' IMDB rating';
        })
        .transitionDuration(500)
        .valueAccessor(function (d) {
            return d.value.average;
        })
        .x(d3.scale.ordinal())
        .y(d3.scale.linear()
            .domain([5, 10]))
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Season")
        .yAxisLabel("IMDB Rating")
        .renderLabel(true)
        .yAxis().ticks(4);

}

function show_top_rated_episodes(ndx) {

    var episodeDim = ndx.dimension(dc.pluck('episode'));
    var ratingGroup = episodeDim.group().reduceSum(dc.pluck('rating'));

    dc.rowChart("#topRatedEps")
        .dimension(episodeDim)
        .group(ratingGroup)
        .width(500)
        .height(300)
        .margins({
            top: 10,
            right: 60,
            bottom: 30,
            left: 20
        })
        .title(function (d){
            return 'Episode ' + d.key[3] + d.key[4] + ' of Season ' + d.key[1] + ' had an IMDB rating of ' + d.value;
        })
        .transitionDuration(500)
         // exclude the 'Others' category in the row chart.
        .othersGrouper(false)
        .elasticX(true)
        .cap(10);


}

function show_score_by_writer(ndx) {

        var writerDim = ndx.dimension(dc.pluck('writer'));
        var avg_ratings_group = writerDim.group().reduce(
    
            // Add a Fact
            function (p, v) {
                p.count++;
                p.total += v.rating;
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
                    p.total -= v.rating;
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
    
    
        dc.barChart('#topRatedWriters')
            .width(500)
            .height(350)
            .margins({
                top: 10,
                right: 60,
                bottom: 55,
                left: 50
            })
            .dimension(writerDim)
            .group(avg_ratings_group)
            .title(function (d){
                return 'Season ' + d.key + ' had an average ' + d.value + ' IMDB rating';
            })
            .transitionDuration(500)
            .valueAccessor(function (d) {
                return d.value.average;
            })
            .x(d3.scale.ordinal())
            .y(d3.scale.linear()
                .domain([5, 10]))
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Season")
            .yAxisLabel("IMDB Rating")
            .renderlet(function(chart){
                chart.selectAll("g.x text")
                .attr('transform', "rotate(-50)");
                })
            .renderLabel(true);
    }

