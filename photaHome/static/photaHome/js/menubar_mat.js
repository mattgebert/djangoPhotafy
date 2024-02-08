
//----------------Menu bar for home page ------------------
if (crnt_pg >= 0) {
  // Set the current page menubar item to white to show its selection.
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



// Bind function to close side nav bar.

// Load  materialize navbar components.
document.addEventListener('DOMContentLoaded', function() {
  var elements = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elements, {
    // Options
  });

  // Bind closing event for the nav window.
  // document.querySelector('ul#mobile-sidebar').on('click', function() {
  //   instances.close();
  // });
});