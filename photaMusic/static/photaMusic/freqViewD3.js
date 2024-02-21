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


// var x = d3.scaleSymlog().rangeRound([0, width]);
// var x = d3.scaleLinear().rangeRound([0, width]);
var x = d3.scaleLog().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height-margin.top-30, 0]);

var xAxis;

var line = d3.line()
.x(function(d) { if (d.x < 1) { return 0;} else {return x(d.x);}})
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
  });
};

var timesegData, max, intervalID, audio, play, pause;

var requestText;
var request = new XMLHttpRequest();
request.responseType = 'arraybuffer';
request.onload = function() {
  requestText = request.response;
  then(JSON.parse(pako.inflate(requestText, { to: 'string' })));
};

request.open('GET',freq_data_path); //Define freq_data_path in template.
request.send();

// d3.json("data.json", function(error, json) {
//     if (error) return console.warn(error);
//   }).then(function(d) {
function then(d) {
  data = d.data;
  blockTime = d.blockTime;
  xaxis = d.xaxis;
  max = d.max;
  timesegData = segmentize(data[timestep]);

  $(document).ready(function() {
    //Set SVG Axis
    // x.domain(d3.extent(timesegData, function (d) { return d.x; })); //issues coz returns 0.
    x.domain([10, d3.max(timesegData, function (d) { return d.x; })]); //issues coz returns 0.
    // y.domain(d3.extent(timesegData, function (d) { return d.y; }));
    y.domain([0, max]);
    //Draw Dataset
    g.append("path")
    .datum(timesegData)
    .attr("d", line);

    // Setup axis
      // Add the x Axis
    xAxis = d3.axisBottom()
        .scale(x)
        // .orient("bottom")
        .ticks(20, ",.1s")
        .tickSize(6, 0);

    svg.append("g")
        .attr("transform", "translate(0," + (height-margin.top-25) + ")")
        // .call(d3.axisBottom(x));
        .call(xAxis);
    // text label for the x axis
    // svg.append("text")
    //     .attr("transform",
    //           "translate(" + (width/2) + " ," +
    //                          (height -margin.top-25) + ")")
    //     .style("text-anchor", "middle")
    //     .text("Date");

    // audio = new Audio("Ellie Goulding - Lights (Phota Remix).mp3");
    // audio = new Audio("Shepard Tone.mp3");
    // audio = new Audio("output.wav");
    // audio = $("audio#track_element")
    audio = new Audio(audio_data_path)

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
// });
};

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

    //Update axes - x doesn't need updating.
    // x.domain(d3.extent(timesegData, function (d) { return d.x; }));
    // x.domain([1, d3.max(timesegData, function (d) { return d.x; })]); //issues coz returns 0.
    // y.domain(d3.extent(timesegData, function (d) { return d.y; }));
    // y.domain([0,max])

    //Update line
    svg.selectAll("path").datum(timesegData)
      .attr("d", line);
    }
  else {
    pause();
    play();
    // progress();
  }
}
