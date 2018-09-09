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

  var i,j,val, minival;
  var indexes = [];
  for (i=0; i<bars-1; i++) {
      indexes.push(i);
  }

  for (i=1; i< bars; i++) {
    //Select a random index from the list of indexes:
    j = Math.floor(Math.random()*(indexes.length-1)); //Length-1 due to comparison needed
    j = indexes.splice(j,1)[0];

    minval = data[j].val;
    val = data[j+1].val;
    if (minval >= val) {
      // Do nothing, order is correct {High to low}
    } else {
      var iind = data[j].ind; //Copy existing index
      //Swap elements:
      data[j].ind = data[j+1].ind;
      data[j+1].ind = iind;
      //Shift positions in list for D3.
      data.splice(j,0,data.splice(j+1,1)[0]);
      i = bars + 1; //End loop
      // alert(j+""+);
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
