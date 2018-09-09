/* ---------------------------------------------------------------------------*/
/* -------------------- Created by Matt Gebert -------------------------------*/
/* ----------------------- Version 1.0 ---------------------------------------*/
/* ---------------------------------------------------------------------------*/

var svg = d3.select("svg.chart"),
// margin = {top: 20, right: 20, bottom: 30, left: 50},
margin = {top:0, right:0, bottom: 0, left: 0},
jsvg = $('svg.chart');
var width = +jsvg.width() - margin.left - margin.right,
height = +jsvg.height() - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
.rangeRound([0, width]);
var y = d3.scaleLinear()
.rangeRound([height, 0]);

var line = d3.line()
.x(function(d) { return x(d.binCentre); })
.y(function(d) { return y(d.count); });

var svgResize = function() {
  //Update Container Elements
  width = +jsvg.width() - margin.left - margin.right;
  height = +jsvg.height() - margin.top - margin.bottom;
  g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  x = d3.scaleLinear()
  .rangeRound([0, width]);
  y = d3.scaleLinear()
  .rangeRound([height, 0]);
};


//Generation of Data Points
var pointGen = function(mean, stdev) {
  //Box Muller Method:
  do {
    xx = 2 * Math.random()/1 - 1;
    yy = 2 * Math.random()/1 - 1;
    rr = xx*xx + yy*yy;
  } while(rr==0 || rr > 1.0);
  dd = Math.sqrt(-2*Math.log(rr)/rr);
  result1 = xx*dd*stdev + mean;
  // result2 = y*d*stdev + mean;
  return result1;
}

var histLow = -10;
var histHigh = 10;
var bins = 100.0;
var binwidth = (histHigh - histLow) / bins;
var data = [];
var i;
for (i=-bins/2; i<bins/2; i++){

  var datum = {
    count: 0,
    binHigh: i + binwidth,
    binLow: i,
    binCentre: i + binwidth/2
  };
  data.push(datum);
  // alert(data.length);
}

//Set SVG Axis
x.domain(d3.extent(data, function(d) { return d.binCentre; }));
// y.domain([0,d3.max(data, function(d) { return d.count; })]);
y.domain([0,10]);
//y.domain([0,1]);
//Draw Dataset
g.append("path")
.datum(data)
.attr("d", line);

//Define function to get next datapoint.
var progress = function() {
  // update the sample
  rand = pointGen(-10,4);
  if (rand > histHigh || rand < histLow) {
    //Do nothing, bar outside range.
  } else {
    binLoc = Math.round((rand-histLow)*bins/(histHigh-histLow));
    data[binLoc].count = data[binLoc].count + 1;
    var max = d3.max(data, function(d) { return d.count; });
    if (max >= 10) {
      y.domain([0, 1.1*max]); //TODO perhaps max+2 or something else.
    } else {
      y.domain([0,10]);
    }
    // update the data association with the path and recompute the area
    svg.selectAll("path").datum(data)
      .attr("d", line);
  }

}
//Set periodic function to progressively generate data.
var intervalID = setInterval(progress, 30);
