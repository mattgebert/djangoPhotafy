//Well done if you've followed the paper trail here...
//This is to hide from eyes other than amy's on Valentines Day!

var track = [0,0,0,0,0,0,0,0,0,0];
var konami = [38,38,40,40,37,39,37,39,66,65];

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if ($.inArray(evt.keyCode), konami) {
        track.shift();
        track.push(evt.keyCode);
        talkToAmy();
    }
};

$(document).ready(function() {
  //  var d = new Date(2017,2,14,0,0,0);
  //  var d2 = new Date(2017,2,15,0,0,0);
  //  if ((Date(Date.now()) >> d) && (Date(Date.now()) << d2)) {



});

function talkToAmy() {
    var keyd = true;
    for (var i=0; i < 10; i++) {
        if (track[i] != konami[i])
            keyd = false;
    };
    if (keyd) {
    $('.msg-para').html(''+
    "Hey Amy!<br />"+
    "&nbsp&nbspHope you've had a happy Valentines day :P I trust you and the family got back from Japan safely!" +
    "You give off a very enthusiastic vibe for new experiences, I'm looking forward to hearing about it!<br />"+
    "&nbsp&nbspSorry I'm not around atm haha, seems like we're both pretty busy but looking forward to catching "+
    "up again soon. I know we said we wouldn't do anything for valentines, because it's not really a big "+
    "fuss especially at the start of a dating period, but eh I can show some sort of initative haha :P<br />"+
    "&nbsp&nbspBefore you begin to think that I've put a serious amount of effort into making this, i've " +
    "been working on a website for a while now and it was really quick to put something like this up!! :-\)<br>"+
    "I'm certainly looking forward to getting to know you better, where ever that may lead!<br/>" +
    "&nbsp")

    $('#load_frame').delay(1000).animate({'opacity':0},2000,function(){$(this).css('display','none');});
  }
};
