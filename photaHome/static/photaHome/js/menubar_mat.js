
//----------------Menu bar for home page ------------------
if (crnt_pg >= 0) {
  $('#menubar-' + menubar_items[crnt_pg]).unbind('mouseenter').unbind('mouseleave')
    .css('background-color','rgba(255,255,255,0.8)')
    .children().children().children().css('color','#114455').delay(400).queue(function() {
      $('.underline').css('background-color','rgba(255,255,255,0.8)');
    });
}else{
  // TODO FIX BELOW, when not on a subpage.
  $('.underline').css('background-color','rgba(255,255,255,0.8)');
};

// matchHeightCustom(".subpagelink");
