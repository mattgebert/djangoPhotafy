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

var area = d3.area()
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) { return y(d.amp); });

//Generation of Data Points
var expfunc = function(xval){
  return +Math.exp(-decay*((-xval)**1.1));
}

var pointsPerPeriod = 80;
var yfunc = function(tval){
  return +Math.pow(Math.sin(2 * Math.PI * tval / pointsPerPeriod),2);
};

var dataPoints = Math.floor(width/5);
//20 = exp((width/5)^1.1 * decay) --> decay = 5 * log(20) / width
var decay = 13*Math.log(10) / width**1.1;
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
    .attr("class","line")
    .attr("d", line);
//Draw area
svg.append("path")
   .data([data])
   .attr("class", "area")
   .attr("d", area);


//Define function to get next datapoint.
var progress = function() {
  // update the list of coordinates
  t = t + 1;

  console.log(t);
  //Remove first entry | earliest time
  data.splice(0,1);
  //Generate new entry
  var datum = {
    time: -t,
    sinamp:+yfunc(t),
    amp:0,
  };
  //Add to stack
  data.push(datum);

  // apply amplitude filter over all points
  for (i=0; i<dataPoints; i++) {
    data[i].amp = expCurve[i] * data[i].sinamp;
  }
  // update axes
  x.domain(d3.extent(data, function(d) { return d.time; }));
  // y.domain([0,d3.max(data, function(d) { return d.amp; })]); //Could do a list here with amplitude ie [0, max(data...)]
  y.domain([0,1]); //Could do a list here with amplitude ie [0, max(data...)]

  // update the data association with the path and recompute the area
  svg.selectAll("path.line").datum(data)
    .attr("d", line);
  svg.selectAll("path.area").datum(data)
    .attr("d", area);

  //Stop t from overflowing after many cycles:
  if (t >= 10*dataPoints) { //TODO: large number multiple
    var lastT = data[dataPoints-1].time % pointsPerPeriod;
    if (lastT < 0) {
      lastT = -lastT;
    }
    for (i=0; i<dataPoints; i++) {
      data[dataPoints - i - 1].time = -(lastT - i);
    }
    t = lastT;
  }
}
//Set periodic function to progressively generate data.
var intervalID
function start() {
  intervalID = setInterval(progress, 60);
}
start();

//Bind Resize events:
var rtime;
var timeout = false;
var delta = 500;
$(window).resize(function() {
  //Stop Iterations
  if (intervalID != 0) {
    clearInterval(intervalID);
    intervalID = 0;
  }

  //Set a timer for end of event
  rtime = new Date();
  if (timeout === false) {
    timeout = true
    setTimeout(resizeSVG, delta);
  }
})

function resizeSVG() {
  if (new Date() - rtime < delta) {
    setTimeout(resizeSVG, delta);
  } else {
    timeout = false;
    //Resize "done". Reset parameters here:
    resizeSinWave();
    start();
  }
}

function resizeSinWave() {
  width = +jsvg.width() - margin.left - margin.right,
  height = +jsvg.height() - margin.top - margin.bottom;
  g.remove()
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x = d3.scaleLinear()
      .rangeRound([0, width]);
  y = d3.scaleLinear()
      .rangeRound([height, 0]);

  pointsPerPeriod = 80;
  dataPoints = Math.floor(width/5);
  decay = 13*Math.log(10) / width**1.1;
  data = [];
  expCurve = [];
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
  t = dataPoints; //Set time = i for couting.

  //Set SVG Axis
  x.domain(d3.extent(data, function(d) { return d.time; }));
  //Draw Dataset
  g.append("path")
      .datum(data)
      .attr("class","line")
      .attr("d", line);

  area.y0(height);

}
