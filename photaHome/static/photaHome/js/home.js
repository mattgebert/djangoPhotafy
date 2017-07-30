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


//----------------Menu bar for home page ------------------
// var crnt_pg = -1; //No page selected
// var ids = ['christian', 'physicist', 'musician','other'];
// function subpg(pgnum) {
//   //First, makes subpage title div static on hover, then sets static colors.
//   if (pgnum != crnt_pg) {
//     $('#' + ids[pgnum]).unbind('mouseenter').unbind('mouseleave')
//     .css('background-color','rgba(255,255,255,0.8)')
//     .children().children().css('color','#114455');
//   }
//
//   //Secondly, reset old page header if already selected.
//   if (crnt_pg != -1) {
//     $('#' + ids[crnt_pg]).hover(function(){
//       $(this).css('background-color','rgba(255,255,255,0.8)')
//       .children().children('i').css('color','#114455')
//       .parents().children('span').css('color','#114455');
//     }, function(){
//       $(this).css('background-color','rgba(0,0,0,0)')
//       .children().children('i').css('color','#77EEEE')
//       .parents().children('span').css('color','#FFFFFF');
//     }).mouseout();
//     $('#cat_' + ids[crnt_pg]).css('display','none');
//   }
//
//   //Thirdly, keep track of selected page.
//   if (crnt_pg == pgnum) {
//     crnt_pg = -1;
//   } else {
//     crnt_pg = pgnum;
//   }
//
//   //Fourthly load subpage elements of new page if not unselected:
//   if(crnt_pg != -1) {
//     $('#cat_'+ids[pgnum]).load(ids[pgnum]+'/index.html', function(){
//       $(this).css('display','block');
//     });
//   }
//
//   //Lastly, change view between frontpage and specific page.
//   if (crnt_pg != -1) {
//     //Generate specific page.
//     $('.underline').css('background-color','rgba(255,255,255,0.8)');
//     $('#category_container').css('display','block');
//     $('#category_container').animate({opacity:1}, 500);
//     scrollTillTop('.links','.information');
//     load_page(0);
//
//   } else {
//     //Return to default view.
//     $('.underline').css('background-color','rgba(0,0,0,0)');
//     scrollTillTop('.space','.information');
//     $('#category_container').animate({opacity:0}, 1000, function(){$(this).css('display','none');})
//   }
// };
