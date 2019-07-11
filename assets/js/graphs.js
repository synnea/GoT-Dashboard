queue()
    .defer(d3.json, "data/got_json.json")

    // load helper function up first

    .await(remove_blanks)
    .await(show_slice_percent)
    .await(print_filter)
    .await(reduceAvg)
    .await(reduceAvgMultiple)
    .await(makeGraphs);


function makeGraphs(error, gotData) {
    var ndx = crossfilter(gotData);

    // Convert the air dates to date data types.

    gotData.forEach(function (d) {
        var airDates = new Date(d.airdate);
        d.airdate = airDates;
    });


    // Call the functions for each individual graph.

    show_total_viewership_by_season(ndx);
    show_avg_viewership_by_season(ndx);
    show_num_eps(ndx);
    show_viewership_over_time(ndx);
    show_season_selector(ndx);
    show_num_deaths(ndx);
    show_number_of_deaths_per_season(ndx);
    show_percentage_of_deaths_per_season(ndx);
    show_top_deathly_episodes(ndx);
    show_deathly_writers(ndx);
    show_avg_score(ndx);
    show_avg_score_per_season(ndx);
    show_top_rated_episodes(ndx);
    show_score_by_writer(ndx);
    show_correlation_between_rating_and_viewership(ndx);


    // Render all the graphs

    dc.renderAll();
}

// ----------------- HELPER FUNCTION ----------------------

//  Function that removes blank values so the line chart doesn't nosedive
// Credit for this function goes to Code Institute student Dave Laffan.

function remove_blanks(group, value_to_remove) {
    // Filter out specified values from passed group
    return {
        all: function () {
            return group.all().filter(function (d) {
                return d.value !== value_to_remove;
            });
        }
    };
}

// The following function enables the printing of crossfilter data. This function was used extensively to look inside crossfilter groups.

function print_filter(filter) {
    var f = eval(filter);
    if (typeof (f.length) != "undefined") {} else {}
    if (typeof (f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof (f.dimension) != "undefined") {
        f = f.dimension(function (d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}


// Convert airdates to a valid date data type



function show_slice_percent(key, endAngle, startAngle) {
    // Return the % of each pie slice as a string to be displayed
    // To save space, %'s below 8% display only the % and no other text.
    var percent = dc.utils.printSingleValue((endAngle - startAngle) / (2 * Math.PI) * 100);
    if (percent > 8) {
        return key + ' | ' + Math.round(percent) + '%';
    } else if (percent > 0) {
        return Math.round(percent) + '%';
    } else {
        return " Percentages ";
    }
}

   // ----------------- HELPER FUNCTION ----------------------

//  Function that removes blank values so the line chart doesn't nosedive
// Credit for this function goes to Code Institute student Dave Laffan.

function remove_blanks(group, value_to_remove) {
    // Filter out specified values from passed group
    return {
        all: function () {
            return group.all().filter(function (d) {
                return d.value !== value_to_remove;
            });
        }
    };
}

// The following function enables the printing of crossfilter data. This function was used extensively to look inside crossfilter groups.

function print_filter(filter) {
    var f = eval(filter);
    if (typeof (f.length) != "undefined") {} else {}
    if (typeof (f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof (f.dimension) != "undefined") {
        f = f.dimension(function (d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}

// Display percentages on the slices of pie charts.

function show_slice_percent(key, endAngle, startAngle) {
    // Return the % of each pie slice as a string to be displayed
    // To save space, %'s below 8% display only the % and no other text.
    var percent = dc.utils.printSingleValue((endAngle - startAngle) / (2 * Math.PI) * 100);
    if (percent > 8) {
        return key + ' | ' + Math.round(percent) + '%';
    } else if (percent > 0) {
        return Math.round(percent) + '%';
    } else {
        return " Percentages ";
    }
}

// Reuseable custom reduce average function for single number averages
    
	function reduceAvg(dimension, type) {
		return dimension.groupAll().reduce(
			function(p, v) {
				p.count++;
				p.total += v[type];
				p.average = p.total / p.count;
				return p;
			},

			function(p, v) {
				p.count--;
				p.total -= v[type];
				p.average = p.total / p.count;
				return p;
			},

			function() {
				return {
					count: 0,
					total: 0,
					average: 0
				};
			}
		);
	}


// Reuseable custom reduce average function for grouping based on averages
    
	function reduceAvgMultiple(dimension, type) {
		return dimension.group().reduce(
			function(p, v) {
				p.count++;
				p.total += v[type];
				p.average = p.total / p.count;
				return p;
			},

			function(p, v) {
				p.count--;
				p.total -= v[type];
				p.average = p.total / p.count;
				return p;
			},

			function() {
				return {
					count: 0,
					total: 0,
					average: 0
				};
			}
		);
	}



// ------------------ NUMBER DISPLAY FUNCTIONS ----------------

// ------------- Number of Episodes Number Display -----------

function show_num_eps(ndx) {

    var numEpGroup = ndx.groupAll();

    dc.numberDisplay("#numEps")
        .group(numEpGroup)
        .valueAccessor(function (d) {
            return d;
        })
};


// ------------- Number of Deaths Number Display -----------

function show_num_deaths(ndx) {

    deathDim = ndx.dimension(dc.pluck('deaths'));
    deathGroup = deathDim.groupAll().reduceSum(dc.pluck('deaths'));

    dc.numberDisplay("#numDeaths")
        .group(deathGroup)
        .valueAccessor(function (d) {
            return d;
        })
}

// ------------- Average IMDB Rating for the entire Series Number Display -----------

function show_avg_score(ndx) {

    var ratingDim = ndx.dimension(dc.pluck('rating'));
    var avgScore = reduceAvg(ratingDim, "rating");

  


    dc.numberDisplay("#avgIMDB")
        .group(avgScore)
        .valueAccessor(function (d) {
            return d.average;
        })

}


// ------------------ GENERAL DASHBOARD GRAPH FUNCTIONS ----------------

// ------------- Total Viewership per Season Bar Chart -----------


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
        .colorAccessor(function (d) {
            return d.key;
        })

        .colors('#6E403A')
        //.ordinalColors(['#6E403A', '#175ac6', '#E57687', '#DACC3E', '#7FB7BE', '#545a2c', '#020202', '#705D56'])
        .dimension(seasonDim)
        .group(total_viewership_per_season)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .y(d3.scale.linear()
            .domain([0, 85]))
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Season")
        .yAxisLabel("Viewership (in millions)")
        .valueAccessor(function (d) {
            return d.value;
        })
        .title(function (d) {
            return 'Season ' + d.key + ' had a total of ' + Math.round(d.value * 100 + Number.EPSILON) / 100 + ' million viewers';
        })
        .brushOn(true)
        .renderLabel(true)
        .elasticX(true)
        .yAxis().ticks(4);



        print_filter("seasonDim");
}

// ------------- Average Episode Viewership per Season Bar Chart -----------

function show_avg_viewership_by_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));

    var avg_views_group = reduceAvgMultiple(seasonDim, 'viewers');

    dc.barChart('#avgViewsSeason')
        .width(500)
        .height(300)
        .margins({
            top: 20,
            right: 60,
            bottom: 30,
            left: 50
        })
        .rescale()
        .brushOn(true)
        .colors('#6E403A')
        .dimension(seasonDim)
        .group(avg_views_group)
        .colorAccessor(function (d) {
            return d.key;
        })
        // .ordinalColors(['#6E403A', '#175ac6', '#E57687', '#DACC3E', '#7FB7BE', '#545a2c', '#020202', '#705D56'])
        .title(function (d) {
            return 'Season ' + d.key + ' had an average of  ' + Math.round(d.value.average * 100 + Number.EPSILON) / 100 + ' million viewers';
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


// ------------- Season Selector -----------

function show_season_selector(ndx) {
    var seasonDim = ndx.dimension(dc.pluck('season'));
    var seasonGroup = seasonDim.group();

    dc.selectMenu("#seasonSelector")
        .dimension(seasonDim)
        .group(seasonGroup)
        .promptText('Season Selector')
        .title(function (d) {
            return 'Season ' + d.key + ': ' + d.value + ' Episodes';
        });

    dc.selectMenu("#seasonSelector-deaths")
        .dimension(seasonDim)
        .group(seasonGroup)
        .promptText('Season Selector')
        .title(function (d) {
            return 'Season ' + d.key + ': ' + d.value + ' Episodes';
        });

    dc.selectMenu("#seasonSelector-IMDB")
        .dimension(seasonDim)
        .group(seasonGroup)
        .promptText('Season Selector')
        .title(function (d) {
            return 'Season ' + d.key + ': ' + d.value + ' Episodes';
        });
}


// ------------- Viewership over Time Composite Line Chart -----------

function show_viewership_over_time(ndx) {


    function views_by_season(season) {
        return function (d) {
            if (d.season === season) {
                return +d.viewers;
            } else {
                return 0;
            }
        }
    };

    var dateDim = ndx.dimension(function (d) {
        return d.airdate;
    });

    var minDate = dateDim.bottom(1)[0].airdate;
    var maxDate = dateDim.top(1)[0].airdate;



    var S2Views = dateDim.group().reduceSum(views_by_season(2));
    var S1Views = dateDim.group().reduceSum(views_by_season(1));
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
        .width(1100)
        .height(400)
        .dimension(dateDim)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Time")
        .yAxisLabel("Viewership (in million)")
        .renderHorizontalGridLines(true)
        .mouseZoomable(true)
        .title(function (d) {
            return d.value + ' million people watched this episode.'
        })
        .legend(dc.legend().x(100).y(30).horizontal(true).itemWidth(70).gap(15))
        .compose([
            dc.lineChart(compositeChart)
            .colors('#6E403A')
            .group(S1Group, 'Season 1'),
            dc.lineChart(compositeChart)
            .colors('#175ac6')
            .group(S2Group, 'Season 2'),
            dc.lineChart(compositeChart)
            .colors('#E57687')
            .group(S3Group, 'Season 3'),
            dc.lineChart(compositeChart)
            .colors('#DACC3E')
            .group(S4Group, 'Season 4'),
            dc.lineChart(compositeChart)
            .colors('#7FB7BE')
            .group(S5Group, 'Season 5'),
            dc.lineChart(compositeChart)
            .colors('#545a2c')
            .group(S6Group, 'Season 6'),
            dc.lineChart(compositeChart)
            .colors('#020202')
            .group(S7Group, 'Season 7'),
            dc.lineChart(compositeChart)
            .colors('#705D56')
            .group(S8Group, 'Season 8'),
        ])
        .brushOn(false)
        .elasticX(true)
        .render();
}


// ------------------ DEATH DASHBOARD GRAPH FUNCTIONS ----------------

// ------------- Number of Deaths per Season Bar Chart -----------


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
        .title(function (d) {
            return 'Season ' + d.key + ' had an total of ' + d.value + ' notable deaths.';
        })
        .colors('#6E403A')
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .y(d3.scale.linear()
            .domain([0, 50]))
        .colorAccessor(function (d) {
            return d.key;
        })
        //.ordinalColors(['#6E403A', '#175ac6', '#E57687', '#DACC3E', '#7FB7BE', '#545a2c', '#020202', '#705D56'])
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Season")
        .yAxisLabel("Deaths")
        .renderLabel(true)
        .yAxis().ticks(4);
}


// ------------- Percentage of Death per Season Pie Chart -----------

function show_percentage_of_deaths_per_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var num_death_group = seasonDim.group().reduceSum(dc.pluck('deaths'));

    dc.pieChart("#deathPercentage")
        .height(300)
        .width(500)
        .radius(100)
        .transitionDuration(500)
        .drawPaths(false)
        .externalLabels(40)
        .title(function (d) {
            return 'Season ' + d.key + ' killed ' + d.value + " notable characters."
        })
        .colorAccessor(function (d) {
            return d.key;
        })
        .ordinalColors(['#545a2c', '#DACC3E', '#175ac6', '#6E403A', '#7FB7BE', '#E57687', '#705D56', '#020202'])
        .dimension(seasonDim)
        .on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                return 'Season ' + show_slice_percent(d.data.key, d.endAngle, d.startAngle);

            });
        })
        .group(num_death_group);
}


// ------------- Top Deathly Episodes Row Chart -----------

function show_top_deathly_episodes(ndx) {

    var episodeDim = ndx.dimension(function (d) {
        return [d.episode,  " " + d.episodename];
    });
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
        .title(function (d) {
            return 'Episode ' + d.key[0] + ' entitled' + "'" + d.key[1]  + "'" + ' killed ' + d.value + ' notable characters.'
        })
        .transitionDuration(500)
        // exclude the 'Others' category in the row chart.
        .othersGrouper(false)
        .cap(10);

}

// ------------- Top Deathly Writers Pie  -----------

function show_deathly_writers(ndx) {

    var writerDim = ndx.dimension(dc.pluck('writer'));
    var deathGroup = writerDim.group().reduceSum(dc.pluck('deaths'));

    dc.pieChart("#topDeathlyWriters")
        .height(300)
        .width(500)
        .radius(80)
        .transitionDuration(500)
        .dimension(writerDim)
        .on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                return show_slice_percent(d.data.key, d.endAngle, d.startAngle);
            });
        })
        .title(function (d) {
            return d.key + ' killed ' + d.value + ' notable characters.';
        })
        .group(deathGroup)
        .minAngleForLabel(0)
        .drawPaths(true)
        .othersGrouper(false)
        .externalLabels(30)
        .cap(4);
}


// ------------------ DEATH IMDB RATINGS GRAPH FUNCTIONS ----------------


// ------------- Average IMDB Score per Season Bar Chart -----------

function show_avg_score_per_season(ndx) {

    var seasonDim = ndx.dimension(dc.pluck('season'));
    var avg_ratings_group = reduceAvgMultiple(seasonDim, 'rating');

    dc.barChart('#avgIMDBSeason')
        .width(500)
        .height(300)
        .margins({
            top: 10,
            right: 60,
            bottom: 30,
            left: 50
        })
        .dimension(seasonDim)
        .group(avg_ratings_group)
        .title(function (d) {
            return 'Season ' + d.key + ' had an average ' + Math.round(d.value.average * 100 + Number.EPSILON) / 100 + ' IMDB rating';
        })
        .transitionDuration(500)
        .valueAccessor(function (d) {
            return d.value.average;
        })
        .colorAccessor(function (d) {
            return d.key;
        })
        .colors('#6E403A')
        .x(d3.scale.ordinal())
        .y(d3.scale.linear()
            .domain([5, 10.5]))
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Season")
        .yAxisLabel("IMDB Rating")
        .renderLabel(true)
        .elasticX(true)
        .yAxis().ticks(4);

}


// ------------- Top Rated Episodes Row Chart -----------

function show_top_rated_episodes(ndx) {

    var episodeDim = ndx.dimension(function (d) {
        return [d.episode,  " " + d.episodename];
    });
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
        .title(function (d) {
            return 'Episode ' + d.key[0] + ' entitled' + "'" + d.key[1]  + "'" + ' reached a ' + d.value + ' IMDB rating.'
        })
        .transitionDuration(500)
        // exclude the 'Others' category in the row chart.
        .othersGrouper(false)
        .elasticX(true)
        .cap(10);


}

// ------------- Average IMDB Score per Writer Bar Chart -----------


function show_score_by_writer(ndx) {

    var writerDim = ndx.dimension(dc.pluck('writer'));
    var avg_ratings_group = reduceAvgMultiple(writerDim, 'rating');

    dc.barChart('#topRatedWriters')
        .width(500)
        .height(300)
        .margins({
            top: 10,
            right: 60,
            bottom: 55,
            left: 50
        })
        .colorAccessor(function (d) {
            return d.key;
        })
        .colors('#6E403A')
        .ordering(function(d){ return -d.value.average })
        .dimension(writerDim)
        .group(avg_ratings_group)
        .title(function (d) {
            return d.key + '\'s episodes had an average ' + Math.round(d.value.average * 100 + Number.EPSILON) / 100 + ' IMDB rating.';
        })
        .transitionDuration(500)
        .valueAccessor(function (d) {
            return d.value.average;
        })
        .x(d3.scale.ordinal())
        .y(d3.scale.linear()
            .domain([5, 10.5]))
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Writer")
        .yAxisLabel("IMDB Rating")
        .renderlet(function (chart) {
            chart.selectAll("g.x text")
                .attr('transform', "rotate(-50)");
        })
        .renderLabel(true);
}


// ------------- Correlation between Rating and Viewership Scatterplot -----------


function show_correlation_between_rating_and_viewership(ndx) {

    var IMDBViewDim = ndx.dimension(function (d) {
        return [d.viewers, d.rating, d.episode, d.season];
    });


    var IMDBViewGroup = IMDBViewDim.group();

    var seasonColors = d3.scale.ordinal()
        .domain(["1", "2", "3", "4", "5", "6", "7", "8"])
        .range(['#6E403A ', '#175ac6', '#E57687', '#DACC3E', '#7FB7BE', '#545a2c', '#020202', '#705D56']);

    dc.scatterPlot("#corrIMDBandViews")
        .dimension(IMDBViewDim)
        .group(IMDBViewGroup)
        .width(700)
        .height(400)
        .colorAccessor(function (d) {
            return d.key[3];
        })

        .colors(seasonColors)
        .y(d3.scale.linear()
            .domain([0, 10]))

        .x(d3.scale.linear()
            .domain([1, 14]))
        .brushOn(false)
        .symbolSize(8)
        .xAxisLabel("Viewers (in million)")
        .yAxisLabel("IMDB Rating")
        .title(function (d) {
            return d.key[2] + " was rated a " + d.key[1] + " and had a viewership of " + d.key[0] + " million.";
        })
        .clipPadding(5);

}