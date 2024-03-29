// https://github.com/d3/d3-hierarchy/blob/master/README.md#tree TODO: Jesus ancestory!
// TODO: https://bl.ocks.org/curran/3a68b0c81991e2e94b19 RESIZING
//TODO: wrap labels! https://stackoverflow.com/questions/24784302/wrapping-text-in-d3?lq=1

var data = {
  "nodes": [
    {"id": "Jesus", "level": 1, "hovtxt":""},
      {"id": "Arguments for God", "level": 2, "hovtxt":"Some people believe Jesus existed, but don't believe the things he said about God and himself. </br> Here are some suggestions as to why God might exist."},
        {"id": "Cosmological argument", "level": 3, "hovtxt":""},
        {"id": "Human conciousness", "level": 3, "hovtxt":""},
        {"id": "Comprehensible universe", "level": 3, "hovtxt":""},
          {"id": "Mathematics", "level": 4, "hovtxt":""},
        {"id": "Universal moral law", "level": 3, "hovtxt":""},
      {"id": "Historical evidence", "level":2, "hovtxt":""},
        {"id": "The gospels describing Jesus","level":3,"hovtxt":""},
        {"id": "Non-christian sources","level":3,"hovtxt":""},
        {"id": "The biblical narative","level":3,"hovtxt":""},
        {"id": "Acts of Jesus' followers","level":3,"hovtxt":""},
      {"id": "FAQ", "level":2, "hovtxt":""},
        {"id": "Evolution & creation", "level":3, "hovtxt":""},
        {"id": "Biblical integrity", "level":3, "hovtxt":""}
  ],
  "links": [
    {"source": "Jesus", "target": "Arguments for God", "value": 1},
      {"source": "Arguments for God", "target": "Cosmological argument", "value": 2},
      {"source": "Arguments for God", "target": "Human conciousness", "value": 2},
      {"source": "Arguments for God", "target": "Comprehensible universe", "value": 2},
        {"source": "Comprehensible universe", "target": "Mathematics", "value": 2},
      {"source": "Arguments for God", "target": "Universal moral law", "value": 2},
    {"source": "Jesus", "target": "Historical evidence","value":1},
      {"source":"Historical evidence","target":"The gospels describing Jesus","value":2},
      {"source":"Historical evidence","target":"Non-christian sources","value":2},
      {"source":"Historical evidence","target":"The biblical narative","value":2},
      {"source":"Historical evidence","target":"Acts of Jesus' followers","value":2},
    {"source": "Jesus", "target": "FAQ", "value": 1},
      {"source":"FAQ","target":"Evolution & creation","value":2},
      {"source":"FAQ","target":"Biblical integrity","value":2}
  ]
}


//Create the SVG Viewport
var svg = d3.select("#evidenceSvg");
// alert(svg);
var width,height;
width = $("#evidenceSvg").width(); //css("width");
height = $("#evidenceSvg").height();
// //TODO add resize event.

var colours = ['#FF7070', '#FFA07A', '#FFD700','#008080', '#5aa97b']; //#48D1CC
var color = d3.scaleOrdinal().range(colours); //d3["schemeSet1"]

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody()
    .strength(function(d) {
      return -Math.floor(10000 / Math.pow(d.level, 0.6)); //120;
      // return -3000;
    }))
    .force("link", d3.forceLink().distance(function(d) {
      console.log(Math.pow(d.value, 0.1));
      return Math.floor(200 / Math.pow(d.value, 1.5)); //120;
      // return 120;
    }).strength(function(d) {
      if (d.source.displayChildren == true) {
        return 5; //1
      } else {
        return 0;
      }
    }).id(function(d) { return d.id; }))
    // .force("center", d3.forceCenter(width / 2, height / 2))
    // .force("center", d3.forceCenter(0,0))
    .force("x", d3.forceX().x(0).strength(0.36)) //0.7
    .force("y", d3.forceY().y(0).strength(0.56)); //0.14 //https://bl.ocks.org/andrew-reid/4aa3dab2265a16626d71b3412a9e4ec6

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
  .enter().append("g")
  .attr("display", function(d) {
    if (d.level > 1) {
      d.displayChildren = false;
      return "none";
    } else {
      d.displayChildren = false;
      return "";
    }
  });


// Define the div for the tooltip
var div = d3.select("#evidence div.svgContainer").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var circles = node.append("circle");
circles
  .attr("r", function(d) { return Math.floor(30/Math.pow(d.level,0.2)); })
  .attr("fill", function(d) { return color(d.level); })
  .call(d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended))
  .on("mouseover", function(d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html(d.hovtxt)
      .style("left", (d3.event.pageX - $('#evidence div.svgContainer').offset().left + 50) + "px")
      .style("top", (d3.event.pageY - $('#evidence div.svgContainer').offset().top - 40) + "px");
    })
  .on("mouseout", function(d) {
      div.transition()
          .duration(500)
          .style("opacity", 0);
  });

var labels = node.append("text");

labels.text(function(d) {
  return d.id.replace('\n',''); //TODO: Wrap https://bl.ocks.org/mbostock/7555321
}).attr("transform", function(d) {
  return "translate(0 ," + (20 + Math.floor(30/Math.pow(d.level,0.2))) + ")";
}).attr("font-size" , function(d) {
  var size = Math.floor(30/Math.pow(d.level,0.6));
  if (size < 12) {
    return 12;
  }
  return size;
});
// .attr("textLength", function(d) { //TODO UPDATE
//   return 3*Math.floor(30/Math.pow(d.level,0.2));
// });


//If you weren't using names, and instead integers, you can instead do these calls on the creation of the simulation, like https://bl.ocks.org/mbostock/95aa92e2f4e8345aaa55a4a94d41ce37.
simulation
  .nodes(data.nodes)
  .on("tick", ticked);
simulation.force("link")
  .links(data.links);


node.append("title")
.text(function(d) { return d.id; });

node.each(function(d) { //Link each node with its parent.
  findParent(d);
});

node.each(function(d) { //Generate hasChild property for onclick behaviour:
  d.hasChildren = hasChild(d);
})

function ticked() {
  link
  .attr("x1", function(d) { return d.source.x + width/2; })
  .attr("y1", function(d) { return d.source.y + height/2; })
  .attr("x2", function(d) { return d.target.x + width/2; })
  .attr("y2", function(d) { return d.target.y + height/2; });

  node
  .attr("transform", function(d) {
    return "translate(" + (d.x + width/2) + "," + (d.y+height/2) + ")";
  })
}

// Allows an input slider to interact with forces  https://bl.ocks.org/mbostock/aba1a8d1a484f5c5f294eebd353842da
// d3.select("input[type=range]")
//     .on("input", inputted);

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

// // d3.json(jsonfile, function(error, svg) {
// //   data = svg;
// //   alert("OK");
// // });

link.attr("display", function(d) {
  if (hasHidingParent(d.target)) {
    return "none";
  } else {
    return "";
  }
});

function expandNodes() {
  node.each(function(d) {
    d.displayChildren = true;
  });
  updateNodes();
};

function collapseNodes () {
  node.each(function(d) {
    d.displayChildren = false;
  });
  updateNodes();
}

function updateNodes() {

  node.attr("display", function(d) {
    if (hasHidingParent(d)) {
      return "none";
    } else {
      return "";
    }
  });

  link.attr("display", function(d) {
    if (hasHidingParent(d.target)) {
      return "none";
    } else {
      return "";
    };
  });

  simulation.force("link").strength(function(d) {
    if (d.source.displayChildren == true) {
      return 1;
    } else {
      return 0;
    }
  });
  simulation.alpha(1).restart();
}

function hasHidingParent(d) {
  if (d.parent != null) {
    if (d.parent.displayChildren == false) {
      return true;
    } else {
      return hasHidingParent(d.parent);
    }
  } else {
    return false;
  }
}

function hasChild(d) {
  for (var i=0; i < data.links.length; i++) {
    if (data.links[i].source.id == d.id) { //Match clicked node with link
      return true;
    }
  }
  return false;

}

function findParent(d) { //Finds parent node.
  d.parent = null;
  for (var i=0; i < data.links.length; i++) {
    if (data.links[i].target.id == d.id) { //Match clicked node with link
      d.parent = data.links[i].source;
    }
  }
}

//Define click behaviour for nodes.
$(document).ready(function(){
  var offsetMenubarHeight = $('.links').height() + 2;
  circles.on("click", function(d) {
    if (d.hasChildren) {
      d.displayChildren = !d.displayChildren; //Invert selection.
      updateNodes();
    } else {
      scrollTillTopOpts(("#"+d.id.replaceAll(" ","-")).replaceAll("'","\\'").replaceAll("&","\\&"),'.MAT', offsetMenubarHeight ,400); //Relies on scroll function defined in CustomFcns.js.
    }
  });
});
