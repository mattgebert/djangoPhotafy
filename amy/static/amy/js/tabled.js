function tabled(urls, buttonIDs, containerIDs) {
  this.urls = urls;
  this.buttonIDs = buttonIDs;
  this.containerIDs = containerIDs;
  var crnt_pg = -1;

  this.load_page = function (i) {
    //1. Update CSS of subpage headers
    if (i != crnt_pg) {
      //Unmark Old marked page menuoption.
      if (crnt_pg!=-1) {
        $('#'+this.buttonIDs[crnt_pg]).hover(function(){
          $(this).css('background-color','rgba(255,255,255,0.8)').css('color','#114455');
        }, function(){
          $(this).css('background-color','rgba(0,0,0,0)').css('color','#FFFFFF');
        }).mouseout();
      } else {

      }

      //Mark new Selection menuoption:
      $('#'+this.buttonIDs[i]).unbind('mouseenter').unbind('mouseleave')
      .css('background-color','rgba(255,255,255,0.8)')
      .css('color','#114455');
      //Update Tracker
      crnt_pg = i;
    }

    //Create vars to enter namespace below:
    var path = this.path;
    var refs = this.refs;

    //2. Hide Current Content:
    $('.subpage').css('opacity',0); //.css('dispaly','none') //:not(#'+cat+'_content)
    //Bring up loading mask.
    $('.loadmask').css('display','block').animate({'opacity':1}, 400, function(){
      //Start Loading new page
      $(".subpage#" + containerIDs[i]).load(urls[i], function(){
      //Upon load, remove mask
        $(".subpage#" + containerIDs[i]).css('opacity',1).css('display','block');
        $('.loadmask').delay(200).animate({'opacity':0}, 1000, function(){
          $(this).css('display','none');
        });
      });
    });
  }

  this.resize = function() {

  }
}
