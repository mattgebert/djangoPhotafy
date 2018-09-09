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
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.amp); });

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
var expfunc = function(xval){
  return +Math.exp(width/height*2*xval/dataPoints);
}
var yfunc = function(xval){
  return +Math.pow(Math.sin(Math.PI * xval * 5 / dataPoints),2);
};
var dataPoints = 400;
var data = [];
var expCurve = [];
var t, i;
for (i=0; i<dataPoints; i++){
  var expDatum = +expfunc(+i-dataPoints);
  var yfn = +yfunc(i);
  var datum = {
    time: +-i,
    sinamp: yfn,
    amp:expDatum * yfn,
  };
  data.push(datum);
  expCurve.push(expDatum);
}
t = i; //Set time = i for couting.

//Set SVG Axis
x.domain(d3.extent(data, function(d) { return d.time; }));
// y.domain([0,d3.max(data, function(d) { return d.amp; })]);
y.domain([0,1]);
//Draw Dataset
g.append("path")
    .datum(data)
    .attr("d", line);

//Define function to get next datapoint.
var progress = function() {
  // update the list of coordinates
  t++;
  data.splice(0,1);
  var datum = {
    time: +-t,
    sinamp:+yfunc(t),
    amp:0,
  };
  data.push(datum);

  // apply amplitude filter:
  for (i=0; i<dataPoints; i++) {
    data[i].amp = expCurve[i] * data[i].sinamp;
  }
  // update axes
  x.domain(d3.extent(data, function(d) { return d.time; }));
  // y.domain([0,d3.max(data, function(d) { return d.amp; })]); //Could do a list here with amplitude ie [0, max(data...)]
  y.domain([0,1]); //Could do a list here with amplitude ie [0, max(data...)]

  // update the data association with the path and recompute the area
  svg.selectAll("path").datum(data)
    .attr("d", line);


  if (t == 2*dataPoints-1) {
    t = dataPoints;
    for (i=0; i < dataPoints; i++) {
      data[i].time = +-i;
    }
  }
}
//Set periodic function to progressively generate data.
var intervalID = setInterval(progress, 30);
