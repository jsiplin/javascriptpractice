var margin = {top: 20, right: 20, bottom: 70, left: 40},
	width = 600 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("#FemUnemployed")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");


// get the data
d3.csv("./csvs/emailexample.csv", function(error, data) {
	if (error) throw error;
	

	// List of subgroups = header of the csv files
	var subgroups = data.columns.slice(1)
	
	// List of groups = species here = value of the first column called group -> I show them on the X axis
	var groups = d3.map(data, function(d){return(d.yearEmp)}).keys()
	
	// Find max y data
	var runningMax = 100;
	for (var iterate in subgroups) {
		var col = subgroups[iterate];
		var currentMax = Math.max.apply(Math, data.map(function(o) { return o[`${col}`]}));
		if (currentMax > runningMax) {
			runningMax = currentMax;
		};
	};
	
	//maxyaxis = runningMax/(0.9); Replace with height in code to Autoscale Y axis
	maxyaxis = runningMax/(0.9);
	// Add X axis
	var x = d3.scaleBand()
		.domain(groups)
		.range([0, width])
		.padding([0.2])
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSize(0));

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, maxyaxis])
		.range([ height, 0 ]);
	svg.append("g")
		.call(d3.axisLeft(y));

	
	// Another scale for subgroup position?
	var xSubgroup = d3.scaleBand()
		.domain(subgroups)
		.range([0, x.bandwidth()])
		.padding([0.05])

	// color palette = one color per subgroup
	var color = d3.scaleOrdinal()
		.domain(subgroups)
		.range(['#e41a1c','#377eb8','#4daf4a','#FFbb00'])

	// Show the bars
	svg.append("g")
		.selectAll("g")
	// Enter in data = loop group per group
		.data(data)
		.enter()
		.append("g")
			.attr("transform", function(d) { return "translate(" + x(d.yearEmp) + ",0)"; })
		.selectAll("rect")
		.data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
		.enter().append("rect")
			.attr("x", function(d) { return xSubgroup(d.key); })
			.attr("y", function(d) { return y(d.value); })
			.attr("width", xSubgroup.bandwidth())
			.attr("height", function(d) { return height - y(d.value); })
			.attr("fill", function(d) { return color(d.key); });



});
