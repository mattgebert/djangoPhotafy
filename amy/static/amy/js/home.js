var crnt_pg = -1; //No page selected
// REQUIRE ID's to be generated by django:
// ie: var ids = ['christian', 'physicist', 'musician','other'];

function subpg(pgnum) {
  //First, makes subpage title div static on hover, then sets static colors.
  if (pgnum != crnt_pg) {
    $('#' + ids[pgnum]).unbind('mouseenter').unbind('mouseleave')
    .css('background-color','rgba(255,255,255,0.8)')
    .children().children().css('color','#114455');
  }

  //Secondly, reset old page header if already selected.
  if (crnt_pg != -1) {
    $('#' + ids[crnt_pg]).hover(function(){
      $(this).css('background-color','rgba(255,255,255,0.8)')
      .children().children('i').css('color','#114455')
      .parents().children('span').css('color','#114455');
    }, function(){
      $(this).css('background-color','rgba(0,0,0,0)')
      .children().children('i').css('color','#77EEEE')
      .parents().children('span').css('color','#FFFFFF');
    }).mouseout();
    $('#cat_' + ids[crnt_pg]).css('display','none');
  }

  //Thirdly, keep track of selected page.
  if (crnt_pg == pgnum) {
    crnt_pg = -1;
  } else {
    crnt_pg = pgnum;
  }

  //Fourthly load subpage elements of new page if not unselected:
  if(crnt_pg != -1) {
    $('#cat_'+ids[pgnum]).load(ids[pgnum]+'/index.html', function(){
      $(this).css('display','block');
    });
  }

  //Lastly, change view between frontpage and specific page.
  if (crnt_pg != -1) {
    //Generate specific page.
    $('.underline').css('background-color','rgba(255,255,255,0.8)');
    $('#category_container').css('display','block');
    $('#category_container').animate({opacity:1}, 500);
    scrollTillTop('.links','.information');
    load_page(0);

  } else {
    //Return to default view.
    $('.underline').css('background-color','rgba(0,0,0,0)');
    scrollTillTop('.space','.information');
    $('#category_container').animate({opacity:0}, 1000, function(){$(this).css('display','none');})
  }
};
