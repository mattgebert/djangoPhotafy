
//----------------Menu bar for home page ------------------
$('#menubar-' + menubar_items[crnt_pg]).unbind('mouseenter').unbind('mouseleave')
  .css('background-color','rgba(255,255,255,0.8)')
  .children().children().children().css('color','#114455').delay(400).queue(function() {
    $('.underline').css('background-color','rgba(255,255,255,0.8)');
  });

matchHeightCustom(".subpagelink");
