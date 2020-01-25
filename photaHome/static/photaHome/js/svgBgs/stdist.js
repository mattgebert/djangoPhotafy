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

var area = d3.area()
    .x(function(d) { return x(d.binCentre); })
    .y0(height)
    .y1(function(d) { return y(d.count); });


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
var bins = Math.floor(width / 1920 * 100.0);
var binwidth = (histHigh - histLow) / bins;
var data = [];
var i;
for (i=-Math.floor(bins/2); i<Math.floor(bins/2); i++){
  var datum = {
    count: 0,
    binHigh: i + binwidth,
    binLow: i,
    binCentre: i + binwidth/2
  };
  data.push(datum);
}

//Set SVG Axis
x.domain(d3.extent(data, function(d) { return d.binCentre; }));
// y.domain([0,d3.max(data, function(d) { return d.count; })]);
y.domain([0,10]);
//y.domain([0,1]);

//Draw Dataset
var lineObj = g.append("path")
.datum(data)
.attr("class", "line")
.attr("d", line);
//Draw area
var areaObj = svg.append("path")
   .data([data])
   .attr("class", "area")
   .attr("d", area);

//Define function to get next datapoint.
var max = 10;
var progress = function() {
  // update the sample
  rand = pointGen(-10,4);
  if (rand > histHigh || rand < histLow) {
    //Do nothing, bar outside range.
  } else {
    binLoc = Math.floor((rand-histLow)*bins/(histHigh-histLow));
    data[binLoc].count = data[binLoc].count + 1;
    max = d3.max(data, function(d) { return d.count; });
    if (max >= 10) {
      y.domain([0, 1.1*max]); //TODO perhaps max+2 or something else.
    } else {
      y.domain([0,10]);
    }

    // update the data association with the path and recompute the area
    svg.selectAll("path.line").datum(data)
      .attr("d", line);
    svg.selectAll("path.area").data([data])
      .attr("d", area);
  }

}

//Set periodic function to progressively generate data.
var intervalID
function start() {
  intervalID = setInterval(progress, 30 * 1920 / width);
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
    resizeStDist();
    start();
  }
}

function resizeStDist() {
  width = +jsvg.width() - margin.left - margin.right,
  height = +jsvg.height() - margin.top - margin.bottom;
  g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  x.rangeRound([0, width]);
  y.rangeRound([height, 0]);
  area.y0(height);

  //Resize number of bins
  bins = Math.floor(width / 1920 * 100.0);
  if (bins > data.length) { //More datapoints
    //Increase data points
    for (i=0; i<bins; i++){
      //Update existing
      if (i < data.length) {
        data[i].binHigh = - bins/2 + i + binwidth;
        data[i].binLow = -bins/2 + i;
        data[i].binCentre = -bins/2 + i + binwidth/2;
        data[i].count = data[i].count / max * 10;
      } else {
        //Add new bins:
        var datum = {
          count: 0,
          binHigh: -bins/2 + i + binwidth,
          binLow: -bins/2 + i,
          binCentre: -bins/2 + i + binwidth/2
        };
        data.push(datum);
      }
    }
  } else if (bins < data.length) { //Less datapoints
    //Remove data points
    for (i=0; i<data.length; i++){
      if (i < bins) {
        //Update existing
        data[i].binHigh = - bins/2 + i + binwidth;
        data[i].binLow = -bins/2 + i;
        data[i].binCentre = -bins/2 + i + binwidth/2;
        data[i].count = data[i].count / max * 10;
      } else {
        //Remove old:
        data.splice(bins,data.length - bins);
      }
    }
  }

  max = d3.max(data, function(d) { return d.count; });
  x.domain(d3.extent(data, function(d) { return d.binCentre; }));
  if (max >= 10) {
    y.domain([0, 1.1*max]); //TODO perhaps max+2 or something else.
  } else {
    y.domain([0,10]);
  }

  svg.selectAll("path.line").datum(data)
    .attr("d", line);
  svg.selectAll("path.area").data([data])
    .attr("d", area);

}
