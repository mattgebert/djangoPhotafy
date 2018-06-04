function tabled(url, refs, names, category) {
  this.path = url;
  this.refs = refs;
  this.names = names;
  this.category = category;
  var crnt_pg = -1;


  //TODO: Update ALGORITHMSSS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  this.fill_page_options = function(){
    //Reset Element Contents:
    $('.subpagemenu').html("");
    for (var i = 0; i<this.refs.length; i++) {
      // document.getElementByClassName("subpagemenu")[0].innerHTML = "Test";
      $('.subpagemenu').append('<div class="row menuoption" id="'+this.refs[i]+
        '" onclick="control.load_page('+i+')"><span>'+this.names[i]+'</span></div>');
      //  += '<div class="row menuoption">'+names[i]+'</div>'
    }
  }

  this.load_page = function (i) {
    //1. Update CSS of subpage headers
    if (i != crnt_pg) {
      //Unmark Old marked page menuoption.
      if (crnt_pg!=-1) {
        $('#'+this.refs[crnt_pg]).hover(function(){
          $(this).css('background-color','rgba(255,255,255,0.8)').css('color','#114455');
        }, function(){
          $(this).css('background-color','rgba(0,0,0,0)').css('color','#FFFFFF');
        }).mouseout();
      } else {

      }

      //Mark new Selection menuoption:
      $('#'+this.refs[i]).unbind('mouseenter').unbind('mouseleave')
      .css('background-color','rgba(255,255,255,0.8)')
      .css('color','#114455');
      //Update Tracker
      crnt_pg = i;
    }

    //Create vars to enter namespace below:
    var path = this.path;
    var refs = this.refs;
    var cat = this.category;

    //2. Hide Current Content:
    $('.content').css('opacity',0); //.css('dispaly','none') //:not(#'+cat+'_content)
    //Bring up loading mask.
    $('.loadmask').css('display','block').animate({'opacity':1}, 400, function(){
      //Start Loading new page
      $("#"+cat+"_content").load(''+path+refs[i]+'/index.html', function(){
      //Upon load, remove mask
        $('#'+cat+'_content').css('opacity',1).css('display','block');
        $('.loadmask').delay(200).animate({'opacity':0}, 1000, function(){
          $(this).css('display','none');
        });
      });
    });
  }

  this.resize = function() {

  }
}
