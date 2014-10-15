function createBarChart(placeholder,data)
{
	var chart;
	nv.addGraph(function() {
		chart = nv.models.multiBarChart()
	      .color(d3.scale.category20().range())
	      .margin({bottom: 50})
	      .transitionDuration(800)
	      .groupSpacing(0.1)
	      .stacked(false)
	      ;
		
	    chart.multibar
	      .hideable(true);

	    chart.reduceXTicks(true).staggerLabels(true);

	    chart.xAxis
	        .showMaxMin(false)
	        .tickFormat(d3.format(',.2f'));

	    chart.yAxis
	        .tickFormat(d3.format(',.1f'));

	    d3.select('#'+placeholder+' svg')
	        .datum(test_data)
	       .call(chart);

	    nv.utils.windowResize(chart.update);

	    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

	    chartObject[placeholder]={
	    	"obj":chart,
	    	"data":data,
	    	"type":"bar"
	    };
	    
	    return chart;
	});
}

function createLineChart(placeholder,data)
{
	var chart;
	nv.addGraph(function() {
		  chart = nv.models.lineChart()
		  .options({
		    margin: {left: 50, bottom: 50},
		    x: function(d,i) { return i;},
		    showXAxis: true,
		    showYAxis: true,
		    transitionDuration: 800
		  })
		  ;

		  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
		  chart.xAxis
		    .tickFormat(d3.format(',.1f'));

		  chart.yAxis
		    .tickFormat(d3.format(',.2f'))
		    ;
		  //chart.forceY([-10,10]);

		  d3.select('#'+placeholder+' svg')
		    .datum(data)
		    .call(chart);

		  //TODO: Figure out a good way to do this automatically
		  nv.utils.windowResize(chart.update);
		  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

		  chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

		  chartObject[placeholder]={
	    	"obj":chart,
	    	"data":data,
	    	"type":"line"
		  };
		  
		  return chart;
		});
}

function createScatterChart(placeholder,data)
{
	var chart;
	nv.addGraph(function() {
	  chart = nv.models.scatterChart()
	                .showDistX(true)
	                .showDistY(true)
	                .useVoronoi(true)
	                .color(d3.scale.category10().range())
	                .transitionDuration(800)
	                ;

	  chart.xAxis.tickFormat(d3.format('.02f'));
	  chart.yAxis.tickFormat(d3.format('.02f'));
	  chart.tooltipContent(function(key) {
	      return '<h2>' + key + '</h2>';
	  });
	  
	  chart.scatter.onlyCircles(true);

	  d3.select('#'+placeholder+' svg')
	      //.datum(randomData(3,10))
	      .datum(data)
	      .call(chart);

	  nv.utils.windowResize(chart.update);

	  chart.dispatch.on('stateChange', function(e) { ('New State:', JSON.stringify(e)); });

	  chartObject[placeholder]={
    	"obj":chart,
    	"data":data,
    	"type":"scatter"
	  };
	  return chart;
	});	
}

function createAreaChart(placeholder,data)
{
	nv.addGraph(function() {
	  var chart = nv.models.stackedAreaChart()
	                .color(d3.scale.category10().range())
	                .transitionDuration(800)
	                ;

	  chart.yAxis
	      .tickFormat(d3.format(',.2f'));

	  d3.select('#'+placeholder+' svg')
	    .datum(data)
	    .transition()
	      .call(chart);

	  nv.utils.windowResize(chart.update);

	  chartObject[placeholder]={
    	"obj":chart,
    	"data":data,
    	"type":"area"
	  };
	  return chart;
	});
}

function createChart(placeholder,data,type)
{
	switch(type)
	{
		case "bar":
			$("#"+placeholder).html("").append("<svg></svg>");
			createBarChart(placeholder,test_data);
			break;
		case "line":
			$("#"+placeholder).html("").append("<svg></svg>");
			createLineChart(placeholder,test_data);
			break;
		case "area":
			$("#"+placeholder).html("").append("<svg></svg>");
			createAreaChart(placeholder,test_data);
			break;
		case "scatter":
			$("#"+placeholder).html("").append("<svg></svg>");
			createScatterChart(placeholder,test_data);
			break;	
	}
}