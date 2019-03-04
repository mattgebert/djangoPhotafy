// Circle Data Set
// var data = [
//   { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
//   { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }
// ];

var data = {
  "nodes": [
    {"id": "Jesus", "group": 1, "hovtxt":"Everything about Christianity comes from belief in Jesus at it's core."},
    {"id": "God", "group": 2, "hovtxt":""},
    {"id": "Cosmilogical argument", "group": 3, "hovtxt":""}
  ],
  "links": [
    {"source": "Jesus", "target": "God", "value": 1},
    {"source": "God", "target": "Cosmilogical argument", "value": 1}
  ]
}


//Create the SVG Viewport
var svg = d3.select("#evidenceSvg");
// alert(svg);
var width,height;
width = $("#evidenceSvg").width(); //css("width");
height = $("#evidenceSvg").height();
// //TODO add resize event.

var color = d3.scaleOrdinal(d3["schemeSet1"]);

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.5))
.force("charge", d3.forceManyBody().strength(-60))
.force("center", d3.forceCenter(width / 2, height / 2));

var link = svg.append("g")
.attr("class", "links")
.selectAll("line")
.data(data.links)
.enter().append("line")
.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

var node = svg.append("g")
.attr("class", "nodes")
.selectAll("g")
.data(data.nodes)
.enter().append("g")

var circles = node.append("circle")
.attr("r", 30)
.attr("fill", function(d) { return color(d.group); })
.call(d3.drag()
.on("start", dragstarted)
.on("drag", dragged)
.on("end", dragended));

var lables = node.append("text")
.text(function(d) {
  return d.id;
})
// .attr('x', 6)
// .attr('y', 3);

node.append("title")
.text(function(d) { return d.id; });

simulation
.nodes(data.nodes)
.on("tick", ticked);

simulation.force("link")
.links(data.links);

function ticked() {
  link
  .attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

  node
  .attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  })
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
// //
// // d3.json(jsonfile, function(error, svg) {
// //   data = svg;
// //   alert("OK");
// // });
