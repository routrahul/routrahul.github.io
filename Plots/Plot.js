var linksInfo = null,linksList = null;
var w = 300, h = 400,x, y;
var counterArray = new Array('sammons.json','sammons1.json','sammons2.json','sammons3.json','sample.json'),counter = 0;

function reDomain(maxValue) {
	var dz = Math.pow(10, Math.round(Math.log(maxValue) / Math.log(10)) - 1);
	return Math.ceil(maxValue / dz) * dz;
}

var color = d3.scale.category20();

d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
		this.parentNode.appendChild(this);
	});
};


function initializePlot()
{

	d3.json(counterArray[counter], function(json) {
		counter++;
		linksInfo = new Array();
		linksList = new Array();
		var data = json.data;
		var nodeList = json.graph.nodes, relationList = json.graph.relations, linksList = new Array(), newMaxX = d3
		.max(data, function(d) {
		return d.x;
		}), newMaxY = d3.max(data, function(d) {
		return d.y;
		}), newMinX = d3.min(data, function(d) {
		return d.x;
		}), newMinY = d3.min(data, function(d) {
		return d.y;
		}), newMaxCeilX = reDomain(newMaxX);
		newMaxCeilY = reDomain(newMaxY);
		newMinCeilX = reDomain(-newMinX);
		newMinCeilY = reDomain(-newMinY);
		sparkLineData = json.sparklines;
		tempNodeList = nodeList;
		oldMaxCeilX = newMaxCeilX;
		oldMaxCeilY = newMaxCeilY;
		oldMinCeilX = newMinCeilX;
		oldMinCeilY = newMinCeilY;
		for ( var i = 0; i < relationList.length; i++) {
			var source = nodeList[relationList[i].source].id;
			var target = nodeList[relationList[i].target].id;
			var value = relationList[i].value;
			linksInfo.push(source + '-' + target);
			var sourceX = null, sourceY = null, targetX = null, targetY = null;
			for ( var j = 0; j < data.length; j++) {
				if (source == data[j].id.trim()) {
					sourceX = data[j].x;
					sourceY = data[j].y;
					break;
				}
			}
			for (j = 0; j < data.length; j++) {
				if (target == data[j].id.trim()) {
					targetX = data[j].x;
					targetY = data[j].y;
					break;
				}
			}
			linksList.push({
				x1 : sourceX,
				y1 : sourceY,
				x2 : targetX,
				y2 : targetY,
				id : source + "-" + target,
				value : value
			});
		}
		var p = 50;
		x = d3.scale.linear().domain(
				[ -newMinCeilX, newMaxCeilX ]).range(
				[ 0, w ]);
		y = d3.scale.linear().domain(
				[ -newMinCeilY, newMaxCeilY ]).range(
				[ h, 0 ]);

		var chart = d3.select('#svgdiv').append(
				'svg:svg').attr('id', 'svg').attr(
				'width', w + p * 2).attr('height',
				h + p * 2);

		vis = chart.append('svg:g').attr('transform',
				'translate(' + p + ',' + p + ')');	
		 var xrule = vis.selectAll('g.x')
		 .data(x.ticks(10))
		 .enter().append('svg:g')
		 .attr('class', 'x');
			
		 xrule.append('svg:line')
		 .attr('class', 'xLine')
		 .style('stroke', '#ccc')
		 .style('shape-rendering', 'crispEdges')
		 .attr('x1', x)
		 .attr('x2', x)
		 .attr('y1', 0)
		 .attr('y2', h);
			
		 xrule.append('svg:text')
		 .attr('class', 'xText')
		 .attr('x', x)
		 .attr('y', h + 10)
		 .attr('dy', '.71em')
		 .attr('text-anchor', 'middle')
		 .attr('font-family', 'Helvetica')
		 .text(x.tickFormat(10));
			
		 var yrule = vis.selectAll('g.y')
		 .data(y.ticks(10))
		 .enter().append('svg:g')
		 .attr('class', 'y');
			
		 yrule.append('svg:line')
		 .attr('class', 'yLine')
		 .style('stroke', '#ccc')
		 .style('shape-rendering', 'crispEdges')
		 .attr('x1', 0)
		 .attr('x2', w)
		 .attr('y1', y)
		 .attr('y2', y);
			
		 yrule.append('svg:text')
		 .attr('class', 'yText')
		 .attr('x', -10)
		 .attr('y', y)
		 .attr('dy', '.35em')
		 .attr('text-anchor', 'end')
		 .attr('font-family', 'Helvetica')
		 .text(y.tickFormat(10));

		var node = vis.selectAll('path.dot').data(data);
		var nodeEnter = node.enter().append("g");
		/**
		 * Creation of Nodes Starts
		 */
		nodeEnter.attr("class", "circle")
		.append('svg:circle').attr("r", 5).attr("id",
				function(d) {
					return "Node;" + d.id.trim();
				})
				.style("fill",function(d) { return color(d.group)})
				.attr("class","node")
				.attr('transform',
				function(d) {
					return 'translate(' + x(d.x) + ','
							+ y(d.y) + ')';
				});

		node.append("title")
      	.text(function(d) { return d.id; });

		links = vis.selectAll('path.links').data(
				linksList, function(d) {
					return d.id;
				});
		links
				.enter()
				.append("svg:g")
				.attr('class', 'dot')
				.append('svg:line')
				.attr("id", function(d) {
					return d.id;
				})
				.attr("value", function(d) {
					var returnVal = d.value;
					return returnVal;
				})
				.attr(
						"class","link")
				.attr('stroke', 'dimgray').attr("x1",
						function(d) {
							return x(d.x1);
						}).attr("y1", function(d) {
					return y(d.y1);
				}).attr("x2", function(d) {
					return x(d.x2);
				}).attr("y2", function(d) {
					return y(d.y2);
				});

		links.append("title").text(function(d) {
			return d.value.toFixed(3);
		});	
		for ( var i = 0; i < data.length; i++) {
			try{
			var el = document.getElementById('Node;'
					+ data[i].id.trim()).parentNode;
			el.parentNode.appendChild(el);
			}
			catch(err)
			{
				console.log(err);
			}
		}		
	});
}

function updateGraph()
{
	d3.json(counterArray[counter], function(json) {
		counter++;
		var data = json.data;
		nodeList = json.graph.nodes,
		relationList = json.graph.relations,
		linksList = new Array(), newMaxX = d3
		.max(data, function(d) {
			return d.x;
		}), 
		newMaxY = d3.max(data,
		function(d) {
			return d.y;
		}), 
		newMinX = d3.min(data,
		function(d) {
			return d.x;
		}), 
		newMinY = d3.min(data,
		function(d) {
			return d.y;
		}),
		newMaxCeilX = reDomain(newMaxX);
		newMaxCeilY = reDomain(newMaxY);
		newMinCeilX = reDomain(-newMinX);
		newMinCeilY = reDomain(-newMinY);
		tempNodeList1 = nodeList;
		for ( var i = 0; i < relationList.length; i++) {
			var source = nodeList[relationList[i].source].id;
			var target = nodeList[relationList[i].target].id;
			var value = relationList[i].value;
			var sourceX = null, sourceY = null, targetX = null, targetY = null;
			for ( var j = 0; j < data.length; j++) {
				if (source == data[j].id.trim()) {
					sourceX = data[j].x;
					sourceY = data[j].y;
					break;
				}
			}
			for (j = 0; j < data.length; j++) {
				if (target == data[j].id.trim()) {
					targetX = data[j].x;
					targetY = data[j].y;
					break;
				}
			}
			linksList.push({
				x1 : sourceX,
				y1 : sourceY,
				x2 : targetX,
				y2 : targetY,
				id : source + "-" + target,
				value : value
			});
		}
		x = d3.scale.linear().domain(
				[ -newMinCeilX, newMaxCeilX ]).range(
				[ 0, w ]);
		y = d3.scale.linear().domain(
				[ -newMinCeilY, newMaxCeilY ]).range(
				[ h, 0 ]);

		var transition_t = 600;
		var xrule = vis.selectAll('g.x')
		 .data(x.ticks(10));
					
		 // xRule Enter
		 var newxrule = xrule.enter().append('svg:g')
		 .attr('class', 'x');
		
		 newxrule.append('svg:line')
		 .attr('class', 'xLine')
		 .style('stroke', '#ccc')
		 .style('shape-rendering', 'crispEdges')
		 .attr('x1', w)
		 .attr('x2', w)
		 .attr('y1', 0)
		 .attr('y2', h)
		 .transition()
		 .duration(transition_t)
		 .attr('x1', x)
		 .attr('x2', x);
		
		 newxrule.append('svg:text')
		 .attr('class', 'xText')
		 .attr('y', h + 20)
		 .attr('dx', '.71em')
		 .attr('text-anchor', 'end')
		 .attr('x', w)
		 .transition()
		 .duration(transition_t)
		 .attr('x', x)
		 .attr('font-family', 'Helvetica')
		 .text(x.tickFormat(10));
		
		 // xLine Update
		 xrule.select('line.xLine')
		 .transition()
		 .duration(transition_t)
		 .attr('x1', x)
		 .attr('x2', x);
		
		 // xText Update
		 xrule.select('text.xText')
		 .transition()
		 .duration(transition_t)
		 .attr('x', x)
		 .attr('font-family', 'Helvetica')
		 .text(x.tickFormat(10));
		
		 // xrule Remove
		 var oldxrule = xrule.exit();
		
		 oldxrule.select('line.xLine')
		 .transition()
		 .duration(transition_t)
		 .attr('x1', w)
		 .attr('x2', w)
		 .remove();
		
		 oldxrule.select('text.xText')
		 .transition()
		 .duration(transition_t)
		 .attr('x', w)
		 .remove();
		
		 oldxrule.transition()
		 .duration(transition_t).remove();
		
		 // yrule variable
		 var yrule = vis.selectAll('g.y')
		 .data(y.ticks(10));
							
		 // yRule Enter
		 var newyrule = yrule.enter().append('svg:g')
		 .attr('class', 'y');
		
		 newyrule.append('svg:line')
		 .attr('class', 'yLine')
		 .style('stroke', '#ccc')
		 .style('shape-rendering', 'crispEdges')
		 .attr('x1', 0)
		 .attr('x2', w)
		 .attr('y1', 0)
		 .attr('y2', 0)
		 .transition()
		 .duration(transition_t)
		 .attr('y1', y)
		 .attr('y2', y);
		
		 newyrule.append('svg:text')
		 .attr('class', 'yText')
		 .attr('x', -10)
		 .attr('dy', '.35em')
		 .attr('text-anchor', 'end')
		 .attr('y', 0)
		 .transition()
		 .duration(transition_t)
		 .attr('y', y)
		 .attr('font-family', 'Helvetica')
		 .text(y.tickFormat(10));
		
		 // yLine Update
		 yrule.select('line.yLine')
		 .transition()
		 .duration(transition_t)
		 .attr('y1', y)
		 .attr('y2', y);
		
		 // yText Update
		 yrule.select('text.yText')
		 .transition()
		 .duration(transition_t)
		 .attr('y', y)
		 .attr('font-family', 'Helvetica')
		 .text(y.tickFormat(10));
		
		 // yrule Remove
		 var oldyrule = yrule.exit();
		
		 oldyrule.select('line.yLine')
		 .transition()
		 .duration(transition_t)
		 .attr('y1', 0)
		 .attr('y2', 0)
		 .remove();
		
		 oldyrule.select('text.yText')
		 .transition()
		 .duration(transition_t)
		 .attr('y', 0)
		 .remove();
		
		 oldyrule.transition()
		 .duration(transition_t).remove();
		var node = null;
		var text = null;
		node = vis.selectAll('g.circle circle')
			.moveToFront()
			.data(data,function(d){return d.id.trim();})
			.transition()
			.duration(transition_t)
			.attr(
				"id",
				function(d) {
					return "Node;"
							+ d.id.trim();
			})
			.attr(
				'transform',
				function(d) {
					return 'translate('
							+ x(d.x) + ','
							+ y(d.y) + ')';
			});
		
		// text = vis.selectAll('g.circle text')
		// .moveToFront()
		// .data(data,function(d){return d.ticker.trim();})
		// .transition()
		// .duration(transition_t).attr("x",
		// 		function(d) {
		// 			return x(d.xs);
		// 		}).attr("y", function(d) {
		// 	return y(d.ys);
		// }).text(function(d) {
		// 	return d.ticker.trim();
		// });
		links = vis.selectAll('g.dot line')
				.moveToFront().data(linksList,
						function(d) {
							return d.id;
						});

		 links
				.transition()
				.duration(transition_t)
				.style('fill', 'tomato')
				.attr("id", function(d) {
					return d.id;
				})
				.attr("value", function(d) {
					var returnVal = d.value;
					return returnVal;
				})

				/**
				 * This is where the links thickness and
				 * colour is determined - Starts
				 */
				.attr(
						"class","link")
				/**
				 * This is where the links thickness and
				 * colour is determined - Ends
				 */
				.attr('stroke', 'dimgray').attr("x1",
						function(d) {
							return x(d.x1);
						}).attr("y1", function(d) {
					return y(d.y1);
				}).attr("x2", function(d) {
					return x(d.x2);
				}).attr("y2", function(d) {
					return y(d.y2);
				});
		links.exit().remove();

		for ( var i = 0; i < data.length; i++) {
			try{
			var check = document.getElementById('Node;'
					+ data[i].id.trim()).parentNode;
			check.parentNode.appendChild(check);
			}
			catch(err)
			{
				console.log(err);
			}
		}
		// links.append("title").text(function(d) {
		// 	return d.value.toFixed(3);
		// });
	});
}

var a = self.setInterval(function(){
	if(counter > 4)
	{
		counter = 0;
	}
	updateGraph();	
},4000);