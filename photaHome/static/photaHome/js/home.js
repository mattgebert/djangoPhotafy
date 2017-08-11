// Testing d3.js scripting!
var data = [4,8,15,18,23,42];

//--------------DIV Graph Generation!-----------------
// d3.select(".chart")
//   .selectAll("div")
//     .data(data)
//   .enter().append("div").style("width", function(d) { return d * 10 + "px"; })
//     .text(function(d) { return d; });


$(document).ready(function() {
  //On Doc Ready, Set the subpage height to a fixed amount.
  var pageBarHeight = $('.links').css('height').replace(/[^-\d\.]/g, '');
  var pageBarTop = $('.links').offset().top;
  var subpageHeight = $(document).height() - pageBarHeight - pageBarTop;
  $('.social-links').css('height', subpageHeight + 'px').css('display','block').animate({opacity:1},300);

  //Temp: Setup Subpage Options - this should be done by database.
  // fill_page_options();

});

//TODO: implement resize functionality for scrolling and scaling elements
function resize_event() {
  var pageBarHeight = $('.links').css('height').replace(/[^-\d\.]/g, '');
  var pageBarTop = $('.links').offset().top;
  var subpageHeight = $(document).height() - pageBarHeight - pageBarTop;
  $('.social-links').css('height', subpageHeight + 'px');
};
