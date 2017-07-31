var svg = d3.select("svg.chart"),
    // margin = {top: 20, right: 20, bottom: 30, left: 50},
    margin = {top:0, right:0, bottom: 0, left: 0},
    jsvg = $('svg.chart');
var width = +jsvg.width() - margin.left - margin.right,
    height = +jsvg.height() - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleLinear()
    .rangeRound([0, width]);
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.sinamp); });



//Generation of Data Points
var expfunc = function(xval){
  return +Math.exp(6*xval/dataPoints);
}
var yfunc = function(xval){
  return +Math.pow(Math.sin(Math.PI * xval / 80),2)*expfunc(xval);
};
var dataPoints = 400;
var data = [];
var i;
for (i=0; i<dataPoints; i++){
  var datum = {
    time: +-i,
    sinamp:+yfunc(i),
    amp:+expfunc(i),
  };
  data.push(datum);
}
//Set SVG Axis
x.domain(d3.extent(data, function(d) { return d.time; }));
y.domain([0,d3.max(data, function(d) { return d.amp; })]);
//Draw Dataset
g.append("path")
    .datum(data)
    // .attr("fill", "none")
    // .attr("stroke", "steelblue")
    // .attr("stroke-linejoin", "round")
    // .attr("stroke-linecap", "round")
    // .attr("stroke-width", 1.5)
    .attr("d", line);

//Define function to get next datapoint.
var progress = function() {
  // update the list of coordinates
  i++;
  var datum = {
    time:+-i,
    sinamp:+yfunc(i),
    amp:+expfunc(i),
  };
  data.splice(0,1);
  data.push(datum);

  // update axes
  x.domain(d3.extent(data, function(d) { return d.time; }));
  y.domain([0,d3.max(data, function(d) { return d.amp; })]); //Could do a list here with amplitude ie [0, max(data...)]

  // update the data association with the path and recompute the area
  svg.selectAll("path").datum(data)
    .attr("d", line);
}
//Set periodic function to progressively generate data.
var intervalID = setInterval(progress, 30);
