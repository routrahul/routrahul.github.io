var linksInfo = null,linksList = null;
var w = 500, h = 600,x, y;

function initializePlot()
{

	d3.json("sammons.json", function(json) {
		linksInfo = new Array();
		linksList = new Array();
		var data = json.data;
		var nodeList = json.graph.nodes, relationList = json.graph.relations, linksList = new Array(), newMaxX = d3
		.max(data, function(d) {
		return d.xs;
		}), newMaxY = d3.max(data, function(d) {
		return d.ys;
		}), newMinX = d3.min(data, function(d) {
		return d.xs;
		}), newMinY = d3.min(data, function(d) {
		return d.ys;
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
				if (source == data[j].ticker.trim()) {
					sourceX = data[j].xs;
					sourceY = data[j].ys;
					break;
				}
			}
			for (j = 0; j < data.length; j++) {
				if (target == data[j].ticker.trim()) {
					targetX = data[j].xs;
					targetY = data[j].ys;
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
	});
}