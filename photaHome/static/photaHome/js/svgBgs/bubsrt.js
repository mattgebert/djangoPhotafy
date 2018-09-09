/* ---------------------------------------------------------------------------*/
/* -------------------- Created by Matt Gebert -------------------------------*/
/* ----------------------- Version 1.0 ---------------------------------------*/
/* ---------------------------------------------------------------------------*/

var svg = d3.select("svg.chart"),
// margin = {top: 20, right: 20, bottom: 30, left: 50},
margin = {top:0, right:0, bottom: 0, left: 0},
jsvg = $('svg.chart');
var formatPercent = d3.format(".0%");
var width = +jsvg.width() - margin.left - margin.right,
  height = +jsvg.height() - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleBand()
    .rangeRound([0,width]).padding(0.1);
var y = d3.scaleLinear()
    .range([height, 0]);

bars = 30;
indexes = []
var i;
for (i=0; i<bars; i++) {
  indexes.push(i);
}

var data = [];
for (i=0; i<bars; i++){
  var j = indexes.splice(Math.floor(Math.random() * indexes.length),1)[0];
  var amp = Math.exp(-(j**2)/(2*10**2));
  var datum = {
    ind: j,
    val: amp,
  };
  data.push(datum);
}
var datacopy = data.slice(0,-1);

x.domain(data.map(function(d) { return d.ind; }));
y.domain([0, d3.max(data, function(d) { return d.val; })*1.5]);


//Set SVG Axis
svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.ind ); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.val); })
      .attr("height", function(d) { return height - y(d.val); });

//Draw Dataset
//Define function to get next datapoint.
var progress = function() {

  var mini = 0;
  var minval = data[mini].val;
  var i,val;
  for (i=1; i< bars; i++) {
    val = data[i].val;
    if (minval > val) {
      mini = i;
      minval = val;
      // if (i == bars-1) {
      //   data = datacopy;
      // }
    } else {
      var iind = data[mini].ind;
      // alert(i + " " + data[i].ind + " " + val);
      // alert(mini + " " + iind + ' ' + minval);
      //Swap elements:
      data[mini].ind = data[i].ind;
      data[i].ind = iind;
      data.splice(mini,0,data.splice(i,1)[0]);
      i = bars + 1; //End loop
    }
  }

  //Rebind data:
  var transition = svg.transition().duration(250),
  delay = 50;

  transition.selectAll(".bar")
  .delay(delay)
  .attr("x", function(d) { return x(d.ind) });

};

//Set periodic function to progressively generate data.
var intervalID = setInterval(progress, 300);
// progress();
