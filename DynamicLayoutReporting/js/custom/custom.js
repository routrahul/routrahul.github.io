/**
 * 
 */
var gridster = null,chartObject={};


function initializeGridster()
{
	gridster = $(".gridster ul")
	.gridster({
		widget_margins : [ 10, 10 ],
		widget_base_dimensions : [(($('#containerDiv').width() / 12)),($(window).height()  / 15)],
		resize : {
			enabled : true,
			stop : function(e, ui, $widget) {
				chartObject[$($($widget).children()[0]).attr("id")].obj.update();
			}
		}
	}).data('gridster');
}

var test_data = 
//	[{"key":"Stream0","values":[{"x":0,"y":24.12511916406631,"series":0},{"x":1,"y":68.37573198951091,"series":0},{"x":2,"y":15.03720327515132,"series":0},{"x":3,"y":19.343900908405425,"series":0},{"x":4,"y":12.684815478852947,"series":0},{"x":5,"y":54.16935765936517,"series":0},{"x":6,"y":22.255582143109504,"series":0},{"x":7,"y":50.88779469777003,"series":0},{"x":8,"y":12.220001420794313,"series":0},{"x":9,"y":10.681861736013984,"series":0},{"x":10,"y":37.552286600804435,"series":0},{"x":11,"y":14.46128751650358,"series":0},{"x":12,"y":19.62678741623989,"series":0},{"x":13,"y":13.076469432009769,"series":0},{"x":14,"y":16.354376004515675,"series":0},{"x":15,"y":14.26287740474077,"series":0},{"x":16,"y":16.79143126821146,"series":0}],"color":"#cccccc"}]

	stream_layers(10,10+Math.random()*10,.1).map(function(data, i) {
  return {
    key: 'Stream' + i,
    values: data
  };
});

$(function() {
	initializeGridster();
	createChart("barChartContainer",test_data,"bar");
	createChart("lineChartContainer",test_data,"line");
	createChart("areaChartContainer",test_data,"area");
	createChart("scatterChartContainer",test_data,"scatter");
});

function changeChartType(obj)
{
	createChart($(obj).attr("data-chartcontainer"),test_data,$(obj).attr("data-charttype"));
}