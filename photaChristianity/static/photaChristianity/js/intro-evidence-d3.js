// Circle Data Set
// var data = [
//   { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
//   { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }
// ];

var data = {
  "nodes": [
    {"id": "Jesus", "level": 1, "hovtxt":"Everything about Christianity comes from belief in Jesus at it's core."},

    {"id": "Arguments for God", "level": 2, "hovtxt":""},
    {"id": "Cosmilogical argument", "level": 3, "hovtxt":""},
    {"id": "Human conciousness", "level": 3, "hovtxt":""},
    {"id": "Comprehensible mathematics", "level": 3, "hovtxt":""},
    {"id": "Universal moral law", "level": 3, "hovtxt":""},

    {"id": "Historical evidence", "level":2, "hovtxt":""},
    {"id": "Biblical accounts","level":3,"hovtxt":""},
    {"id": "Non-christian sources","level":3,"hovtxt":""},

    {"id": "Resolvable issues", "level":2, "hovtxt":""},
    {"id": "Evolution & creation", "level":3, "hovtxt":""},
    {"id": "Biblical integrity", "level":3, "hovtxt":""}
  ],
  "links": [
    {"source": "Jesus", "target": "Arguments for God", "value": 1},
    {"source": "Jesus", "target": "Historical evidence","value":3},
    {"source": "Jesus", "target": "Resolvable issues", "value": 1},

    {"source": "Arguments for God", "target": "Cosmilogical argument", "value": 2},
    {"source": "Arguments for God", "target": "Human conciousness", "value": 2},
    {"source": "Arguments for God", "target": "Comprehensible mathematics", "value": 2},
    {"source": "Arguments for God", "target": "Universal moral law", "value": 2},

    {"source":"Historical evidence","target":"Biblical accounts","value":3},
    {"source":"Historical evidence","target":"Non-christian sources","value":3},

    {"source":"Resolvable issues","target":"Evolution & creation","value":2},
    {"source":"Resolvable issues","target":"Biblical integrity","value":2}
  ]
}


//Create the SVG Viewport
var svg = d3.select("#evidenceSvg");
// alert(svg);
var width,height;
width = $("#evidenceSvg").width(); //css("width");
height = $("#evidenceSvg").height();
// //TODO add resize event.

var colours = ['#FF8080', '#FFA07A', '#FFD700','#008080', '#5aa97b']; //#48D1CC
var color = d3.scaleOrdinal().range(colours); //d3["schemeSet1"]

//// Functions for force links:
// function count(link) {
//   var val = 0, i=0;
//   for (i=0; i < data.links.length; i++) {
//     if (data.links.source == link) {
//       val++;
//     } else {
//       if (data.links.target == link) {
//         val++;
//       }
//     }
//   }
//   return val;
// }
  // function(d) {
  //   return 1 / Math.min(count(link.source), count(link.target));
  // }

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink().distance(100).strength(function(d) {
      return 1;
    }).id(function(d) { return d.id; }))
    // .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX().strength(0.07))
    .force("y", d3.forceY().strength(0.14));

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return 10/Math.sqrt(d.value); });

var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter().append("g");

var circles = node.append("circle")
    .attr("r", function(d) { return 30/Math.pow(d.level,0.2); })
    .attr("fill", function(d) { return color(d.level); })
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

var lables = node.append("text")
.text(function(d) {
  return d.id;
});

//If you weren't using names, and instead integers, you can instead do these calls on the creation of the simulation, like https://bl.ocks.org/mbostock/95aa92e2f4e8345aaa55a4a94d41ce37.
simulation
  .nodes(data.nodes)
  .on("tick", ticked);
simulation.force("link")
  .links(data.links);

  // .force("forceX", d3.forceX(width/2).strength(function(d) { return hasLinks(d,data.links) ? 0 : 0.05; }) )
	// .force("forceY", d3.forceY(height/2).s/trength(function(d) { return hasLinks(d,data.links) ? 0 : 0.05; }) );


node.append("title")
.text(function(d) { return d.id; });

function ticked() {
  link
  .attr("x1", function(d) {
    return d.source.x + width/2; //
  }).attr("y1", function(d) { return d.source.y + height/2; })
  .attr("x2", function(d) { return d.target.x + width/2; })
  .attr("y2", function(d) { return d.target.y + height/2; });
  node
  .attr("transform", function(d) {
    return "translate(" + (d.x + width/2) + "," + (d.y+height/2) + ")";
  })
}

d3.select("input[type=range]")
    .on("input", inputted);

function inputted() {
  simulation.force("link").strength(+this.value);
  simulation.alpha(1).restart();
}


function hasLinks(d, links) {
    var isLinked = false;

	links.forEach(function(l) {
		if (l.source.id == d.id) {
			isLinked = true;
		}
	})
	return isLinked;
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
