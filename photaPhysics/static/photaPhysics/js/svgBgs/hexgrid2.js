
//for some reason multiplicitive factor stops generation of very large hight and many more nodes than necessary. Not an issue with the width.
var width = $(".svgContainer").css("width").replace(/[^-\d\.]/g, '')*1.001,
height = $(".svgContainer").css("height").replace(/[^-\d\.]/g, '')*1.001,
radius = 25;

function hexTopology(radius, width, height) {
  var dx = radius * 2 * Math.sin(Math.PI / 3),
  dy = radius * 1.5,
  m = Math.ceil((height + radius) / dy) + 1,
  n = Math.ceil(width / dx) + 1,
  geometries = [],
  arcs = [];

  for (var j = -1; j <= m; ++j) {
    for (var i = -1; i <= n; ++i) {
      var y = j * 2, x = (i + (j & 1) / 2) * 2;
      arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
    }
  }

  for (var j = 0, q = 3; j < m; ++j, q += 6) {
    for (var i = 0; i < n; ++i, q += 3) {
      geometries.push({
        type: "Polygon",
        arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
        // fill: Math.random() > j / n * 2
        fill: false
      });
    }
  }

  return {
    transform: {translate: [0, 0], scale: [1, 1]},
    objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
    arcs: arcs
  };
}

function hexProjection(radius) {
  var dx = radius * 2 * Math.sin(Math.PI / 3),
  dy = radius * 1.5;
  return {
    stream: function(stream) {
      return {
        point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
        lineStart: function() { stream.lineStart(); },
        lineEnd: function() { stream.lineEnd(); },
        polygonStart: function() { stream.polygonStart(); },
        polygonEnd: function() { stream.polygonEnd(); }
      };
    }
  };
}

var topology = hexTopology(radius, width, height);

var projection = hexProjection(radius);

var path = d3.geoPath()
.projection(projection);


var svg = d3.select(".lattice")
.attr("width", width)
.attr("height", height);

var hexs = svg.append("g")
.attr("class", "hexagon")
.selectAll("path")
.data(topology.objects.hexagons.geometries)
.enter().append("path")
.attr("m", function(d,i) { return i; })
.attr("d", function(d) { return path(topojson.feature(topology, d)); })
.attr("class", function(d) { return d.fill ? "fill" : null; })
.on("mousedown", mousedown)
.on("mousemove", mousemove)
.on("mouseup", mouseup);

svg.append("path")
.datum(topojson.mesh(topology, topology.objects.hexagons))
.attr("class", "mesh")
.attr("d", path);

var border = svg.append("path")
.attr("class", "border")
.call(redraw);

var mousing = 0;

function mousedown(d) {
  mousing = d.fill ? -1 : +1;
  mousemove.apply(this, arguments);
}

function mousemove(d) {
  // TODO: If you want to re-enamble interaction this function is core for clicking.
  // if (mousing) {
  //   d3.select(this).classed("fill", d.fill = mousing > 0);
  //   border.call(redraw);
  // }
}

function mouseup() {
  mousemove.apply(this, arguments);
  mousing = 0;
}

function redraw(border) {
  border.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
}


var dx = radius * 2 * Math.sin(Math.PI / 3),
dy = radius * 1.5,
m = Math.ceil((height + radius) / dy) + 1,
n = Math.ceil(width / dx) + 1;
var possibleIndexes = [];
// alert("m:" + m + "\nn:" + n)

function getUnfilledAjacent(rand, onlyUnfilledFlag) {
  //Reset indexes:
  possibleIndexes = [];
  //  From a given index, checks one by one the surrounding items.
  var left = ((rand % n) > 0); //Does a node to the left exist?
  var right = ((rand % n) < n-1); //Does a node to the right exist?
  var up = (Math.floor(rand/n) > 1); //Does a node above exist?
  var down = (Math.floor(rand/n) < m); //Does a node below exist?

  //Need to check which hexagonal row this is. The hexagonal pattern repeats every second row.
  var rowOffset = (rand % (2*n)) >= n;

  if (!left) {
    //Check which row if needs to add leftside up and down.
    if (!rowOffset) { //If false, need to add.
      possibleIndexes.push(rand-n);
      possibleIndexes.push(rand+n);
    }
  } else {
    possibleIndexes.push(rand-1);
    if (up) {
      possibleIndexes.push(rand-n-rowOffset);
    };
    if (down) {
      possibleIndexes.push(rand+n-rowOffset);
    };
  }
  if (right) {
    possibleIndexes.push(rand+1);
    if (up) {
      possibleIndexes.push(rand-n+1-rowOffset);
    };
    if (down) {
      possibleIndexes.push(rand+n+1-rowOffset);
    };
  };

  //Check each index to see if unfilled
  var unfilledIndexes = [];
  for (var i = 0; i<possibleIndexes.length; i++) {
    if (d3.select(hexs._groups[0][possibleIndexes[i]]).attr("class") == "") {
      unfilledIndexes.push(possibleIndexes[i]);
    } else {
      //Do nothing, already filled.
    }
  };
  return possibleIndexes;
}

function nodeHighlightDecay(singleHex, i) {
  nodeHighlight(singleHex, i);
  nodeDecay(singleHex, i);
};


function nodeHighlight(singleHex, i) {
  setTimeout(function() {
    if (singleHex.attr("class") == "fill") {
      topology.objects.hexagons.geometries[singleHex.attr("m")].fill = false;
      singleHex.classed("fill", false);
    } else {
      topology.objects.hexagons.geometries[singleHex.attr("m")].fill = true;
      singleHex.classed("fill", true);
    }
    border.call(redraw);
  }, i*50);
}

function nodeDecay(singleHex, i) {
  setTimeout(function() {
    if (singleHex.attr("class") == "fill") {
      topology.objects.hexagons.geometries[singleHex.attr("m")].fill = false;
      singleHex.classed("fill", false);
    } else {
      topology.objects.hexagons.geometries[singleHex.attr("m")].fill = true;
      singleHex.classed("fill", true);
    }
    border.call(redraw);
  }, 5000 + 50*i);
}


function progress() {
  var maxLength = 10;
  var minLength = 2;
  //Stop condition - find a note that is not filled.
  var filled = true;
  while (filled) {
    //Code to test a particular edge of the code - change offset 45 etc.
    // var rand = 45 + Math.floor(Math.random()*m)*45;

    //Select random node, check if filled.
    var rand = Math.floor(Math.random()*hexs._groups[0].length);
    var singleHex = d3.select(hexs._groups[0][rand]);
    if (singleHex.attr("class") != "fill") {
      filled = false;
    }
  }
  var linkLength = Math.floor(Math.random()*(maxLength-minLength)+minLength);
  // var newHexs = getUnfilledAjacent(rand, true);
  // console.log(newHexs.length)
  // nodeHighlightDecay(singleHex, 0);
  // for (var i = 0 ; i < newHexs.length; i++) {
  //   nodeHighlightDecay(d3.select(hexs._groups[0][newHexs[i]]), i+1);
  // }

  //Need a list to track highlighted nodes during this run, due to the delay between "filling".
  var highlightedNodeSet = [];
  highlightedNodeSet.push(rand)

  for (var i = 0; i<linkLength; i++) {
    nodeHighlightDecay(singleHex, i);
    // setTimeout(function(i) {alert(i);}, i*50);
    if (i+1 < linkLength ) {
      var newHexs = getUnfilledAjacent(rand,true);
      var filled = true;
      while (filled) {
        filled = false;
        var ind = Math.floor(Math.random()*newHexs.length)
        rand = newHexs[ind];
        for (j = 0; j < highlightedNodeSet.length; j++) {
          if (rand == highlightedNodeSet[j]) {
            filled = true;
            //Remove filled node of new hexes:
            newHexs.splice(ind, 1);
          }
        }
      }
      singleHex = d3.select(hexs._groups[0][rand]);
      highlightedNodeSet.push(rand);
    }
  }
};

//Set periodic function to progressively generate data.
var intervalID
function start() {
  intervalID = setInterval(progress, 700);
}
function stop() {
  if (intervalID != -1) {
    clearInterval(intervalID);
    intervalID = -1;
  }
}
start();

//Bind Resize events:
var rtime1;
var timeout1 = false;
var delta1 = 500;
$(window).resize(function() {
  //Stop Iterations
  stop()
  //Set a timer for end of event
  rtime1 = new Date();
  if (timeout1 === false) {
    timeout1 = true;
    setTimeout(resizeTrigger, delta1);
  }
})

function resizeTrigger() {
  if (new Date() - rtime1 < delta1) {
    setTimeout(resizeTrigger, delta1);
  } else {
    timeout1 = false;
    //Resize "done". Reset parameters here:

    start()
  }
}

function resizeHexGrid() {

}
