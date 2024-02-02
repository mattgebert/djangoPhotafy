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


var neutronRate = 50 //per second
var initialPolarisation = 0.5

function polarisedNeutronReflectometryApparatus():
  var srcx = 0.05*width
  var srcy = 0.95*height

  var neutron_src = jsvg.append(g)

  return



function progress() {
  return


// var intervalID = setInterval(progress, 300);
