var json1Initialized = true;

function initializaGraph()
{
	d3.json("miserables1.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll("line.link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll("circle.node")
      .data(json.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});
}

function updateGraph()
{
	d3.json("miserables.json", function(json) {
		json1Initialized = true;
		svg.selectAll("line")
		.data(json.links);
				
				// svg.selectAll("line title")
				// .data(json.links);
				
	//			var text = line.
		force
		.links(json.links)
		. start();
	});
}

function updateGraphAgain()
{
	d3.json("miserables1.json", function(json) {
		json1Initialized = false;
		svg.selectAll("line")
		.data(json.links);
				
				// svg.selectAll("line title")
				// .data(json.links);
				
	//			var text = line.
		force
		.links(json.links)
		. start();
	});
}

var a = self.setInterval(function(){
	if(json1Initialized)
	{
		updateGraphAgain();
	}
	else
	{
		updateGraph()
	}	
},8000);