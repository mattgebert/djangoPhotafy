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


var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

var line = d3.line()
.x(function(d) { return x(d.x); })
.y(function(d) { return y(d.y); });

// var svgResize = function() {
//   //Update Container Elements
//   width = +jsvg.width() - margin.left - margin.right;
//   height = +jsvg.height() - margin.top - margin.bottom;
//   g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//   x = d3.scaleLinear().rangeRound([0, width]);
//   y = d3.scaleLinear().rangeRound([height, 0]);
// };

//Aquire data
var data, blockTime, xaxis;
var timestep = 0;
var segmentize = function(data) {
  return data.spectra.map(function(d,i) {
      return {"x":xaxis[i], "y":d}
      // return {"x":i, "y":i*i}
      // return {"x":d.x, "y":d.y*d.y}
  });
};

var timesegData, max, intervalID, audio, play, pause;


d3.json("data.json", function(error, json) {
  if (error) return console.warn(error);
}).then(function(d) {
  data = d.data;
  blockTime = d.blockTime;
  xaxis = d.xaxis;
  max = d.max;
  timesegData = segmentize(data[timestep]);

  $(document).ready(function() {
    //Set SVG Axis
    x.domain(d3.extent(timesegData, function (d) { return d.x; }));
    // y.domain(d3.extent(timesegData, function (d) { return d.y; }));
    y.domain([0, max]);
    //Draw Dataset
    g.append("path")
    .datum(timesegData)
    .attr("d", line);

    audio = new Audio("Ellie Goulding - Lights (Phota Remix).mp3");

    play = function() {
      // Set periodic function to progressively generate data.
      if (!playing) {
        intervalID = setInterval(progress, blockTime * 1000);
        audio.play();
        playing = true;
      }
    }
    pause = function() {
      if (playing) {
        clearInterval(intervalID)
        audio.pause();
        playing=false;
      }
    }
  });
});

var playing = false;



Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

// //Define function to get next datapoint.
var progress = function() {
  var audioTime = audio.currentTime;
  timestep = Math.round(audioTime/blockTime);
  // update the sample
  if(timestep < data.length) {
    timestep += 1;
    timesegData = segmentize(data[timestep]);

    //Update axes
    x.domain(d3.extent(timesegData, function (d) { return d.x; }));
    // y.domain(d3.extent(timesegData, function (d) { return d.y; }));
    y.domain([0,max])

    //Update line
    svg.selectAll("path").datum(timesegData)
      .attr("d", line);
    }
}
