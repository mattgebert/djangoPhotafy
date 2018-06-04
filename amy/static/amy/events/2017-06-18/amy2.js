//Well done if you've followed the paper trail here...
//This is to hide from eyes other than amy's on Valentines Day!

var track = [0,0,0,0,0,0,0,0,0,0];
var konami = [38,38,40,40,37,39,37,39,66,65];

document.onkeydown = function(evt) {
  evt = evt || window.event;
  if ($.inArray(evt.keyCode), konami) {
    track.shift();
    track.push(evt.keyCode);
    codeCheck();
  }
};
var docEnabled = false;
$(document).ready(function() {
  docEnabled = true;
  $("#loadtxt").delay(2000).html("Please enter the konami code! :D");
  // talkToAmy();
  // beginSlides();
  // loadSlides();
});


/* ------------------------Slideshow Functionality ----------------------------------*/

var viewportWidth = window.innerWidth;//$(document).width();
var viewportHeight = window.innerHeight;//$(document).height();

// var db_img_count = 4;

var animationTurn = 0;
function animateImg(im) {
  var localAnimation = animationTurn; //Copy local animation.

  animationTurn = animationTurn + 1;
  if (animationTurn > 7) {
    animationTurn = 0;
  };

  // alert("animating image...");
  //Get img width and height.
  var imgWidth = parseInt(im.css("width"));//width();
  var imgHeight = parseInt(im.css("height"));//height();
  // //Apply local animation.
  var set = animationSet[localAnimation];
  im.css('left',""+(set["xi"] + imgWidth*set["xii"])+"px") //Position
    .css('top',""+(set["yi"] + imgHeight*set["yii"])+"px")
    .css('display','block') //Show image
    .animate({ //Animate image.
      'left':""+(set['xf'] + imgWidth*set["xfi"])+"px",
      'top':""+(set['yf'] + imgHeight*set["yfi"])+"px"
    }, set['duration']
    , "linear"
    , function(){
      $(this).css('display','none'); //Hide image
      animateNext();
    });
};

var runSlides = false;
var picNum = 1;
// REQUIRES db_img_count to be defined in HTML file by Django
function animateNext() {
  // alert("animating next!");
  if (picNum > db_img_count) {
    picNum = 1;
  };
  if(runSlides) {
    animateImg($("#db_img" + picNum));
    picNum = picNum + 1;
  }
};

// REQUIRES db_img_count to be defined in HTML file by Django
var imagesNotScaled = true;
function animateSlides() {
  var i = 0;
  //make all images an appropriate size
  if (imagesNotScaled) {
    for (i=0; i< db_img_count; i++) {
      var im = $("#db_img" + i);
      var imgWidth = parseInt(im.css("width"));//width();
      var imgHeight = parseInt(im.css("height"));//height();

      var greaterWidth = imgWidth * 7/4 /viewportWidth;

      if(greaterWidth > 1) {
        //Scale Width and Height
        im.css("width", imgWidth/greaterWidth);
        im.css("height", imgHeight/greaterWidth);
        //Update width and height
        imgWidth = parseInt(im.css("width"));//width();
        imgHeight = parseInt(im.css("height"));//height();
      };
      var greaterHeight = imgHeight * 7/4 / viewportHeight;
      if(imgHeight > 1) {
        //Scale Width and Height
        im.css("width", imgWidth/greaterHeight);
        im.css("height", imgHeight/greaterHeight);
      }
    }
    imagesNotScaled = false;
  }
  // initialise animation of slides
  for (i=0; i<3; i++) { // i<X --> X Determines how many slides run at once.
    animateNext();
  };
};


function beginSlides() {
  $('#picture_frame').delay(200).css('display','block').animate({'opacity':1},2000);
  $('#vid_frame').delay(200).animate({'opacity':0},2000,function(){
    $(this).css('display','none');
    pauseVideo();
  });
  $('#messageFrame').delay(200).animate({'opacity':0},2000,function(){$(this).css('display','none');});
  runSlides = true;
  animateSlides();
};

function returnToMessage() {
  playVideo();
  $('#picture_frame').delay(200).animate({'opacity':0},2000,function(){$(this).css('display','none');});
  $('#vid_frame').delay(200).css('display','block').animate({'opacity':1},2000);
  $('#messageFrame').delay(200).css('display','block').animate({'opacity':1},2000);
  runSlides = false;
};


/* ---------------------KEYPRESS FUNCTION EVENT FOR KONAMI -----------------------------------*/
function codeCheck() {
  var keyd = true;
  for (var i=0; i < 10; i++) {
      if (track[i] != konami[i])
          keyd = false;
  };
    if (keyd && docEnabled){
      if(vidReady && audReady) {
        talkToAmy();
      } else {
        alert("Content still loading");
      };
    };
};

// /* --------------------- Functions to control Video Content -------------------------- */
//
var vid = $("#bgvid");
var aud = $("#bgaud");
function playAudioVideo() {
    //VIDEO
    // var vid = $("video");
    playVideo();
    //AUDIO
    playAudio();
};
function playAudio() {
  aud[0].volume = 0.5;
  aud[0].play();
}
function playVideo() {
    vid[0].playbackRate = 1;
    vid[0].play();
}
function pauseVideo() {
  vid[0].pause();
}

var vidReady = false;
vid.ready(function(){
  vidReady = true;
});

var audReady = false;
aud.ready(function() {
  audReady = true;
});
//
// /*----------------------------- Special Functions ---------------------------------------*/
function talkToAmy() {

    $('.msg-para').html(''+
    "Ames!! :) :)<br/><br/>"+
    "&nbspAhhh where to begin! It's currently been 141 days (just short of 5 months) since the 28th of Janurary, our first date in the Botanic Gardens!<br/>"+
    "I've heavily appreciated the chance you've given me in getting to know you much better, and our relationship you've participated in earnestly! "+
    "You've been there to support me and encourage me in difficult times already, make sure I get to sleep at a reasonable time (sorry I don't always listen to you), "+
    "and genuinely just be someone supportive in my life.<br/>&nbspIn you I find such a joyful, loving person (it's also ok not to be joyful fyi) and being able to see you "+
    "amongst your family and friends has been a serious pleasure. You show concern for those closest to you and will go out of your way to do some little things! That's awesome! "+
    "I know you've been thinking about the girl at your church alot, and that you lack the time to be able to do everything you would like to, but even by your " +
    "reaction to such an event and sharing that concern I know you'll try your best to help out in that circumstance.<br/>" +
    "I think beyond anything else I'd love to see your passion for Christ grow and direct your life and the time you spend doing things. " +
    "I think that's probably why I reacted a little odd the other day when you were telling me that you weren't sure about doing beach mission or SUTS this coming year haha, " +
    "but I recon you earnestly want to follow Jesus' instructions and become more like him in which we have hope.<br/><br/>" +
    "&nbsp&nbsp&nbsp&nbsp\"Love the Lord your God with all your heart and with all your soul and with all your mind.\" ~ Matthew 22<br/><br/>" +
    "&nbspI will be praying that you will be true for you (and me), and that you be able to encourage others and grow in confidence of Gods awesome providence in our needs of assurance.</br>" +
    "&nbspI'm very excited that you'll be able to have a fantastic time overseas with Sus, and I pray that God will be with you in that time!<br/>"+
    "&nbspI honestly do believe I am lucky to have you in my life. Putting this into Gods hands is pretty important, and if we do continue I think it'll be awesome. " +
    "If not (and I can't see why not haha) then I'm still to lucky to have got to know you and have friendship with you! (Don't take that a sign of anything haha, it's not, " +
    "I'm just really appreciative of your support and care).<br/>" +
    "&nbspCongratulations on hitting that massive adult milestone of 20 years old bahaha, won't be as important as 21 but hey you're doing a-ok :P<br/>" +
    "Can't wait to spend some time with you when you're back from america, but we'll have to make sure to skype and keep in touch when you're off busy overseas! :D You're going "+
    "to have so much fun I can't even imagine! :)<br/>"+
    "&nbspI pray that God will speak into your life, that you will feel his love and that this will outpour from you onto those around you. I pray that " +
    "in following and spending time more and more with him you will be content and be able to have a deep desire for godly things and not desires from this world.</br></br>" +
    "I love you, many kissed and hugs to the special birthday girl,"+
    "&nbsp");

    $('#load_frame').delay(1000).animate({'opacity':0},2000,function(){$(this).css('display','none');});
    playAudioVideo();
  };


/* ---------------------------------- ANIMATION SET DEFINED ---------------------------------*/
var animationSet = {
  0:{ //Top left to bottom right
    'duration':10000,
    'xi':0,'yi':0,
    'xf':viewportWidth,
    'yf':viewportHeight,
    'xii':-1,'xfi':0,
    'yii':-1,'yfi':0,
    },
  7:{ //Top right to bottom left
    'duration':7000,
    'xi':viewportWidth,
    'yi':0,
    'xf':0,
    'yf':viewportHeight,
    'xii':0,'xfi':-1,
    'yii':-1,'yfi':0,
  },
  2:{ //Bottom right to top left
    'duration':8000,
    'xi':viewportWidth,
    'yi':viewportHeight,
    'xf':0,
    'yf':0,
    'xii':0,'xfi':-1,
    'yii':0,'yfi':-1,
    },
  4:{ //Bottom left to top right
    'duration':5000,
    'xi':0,
    'yi':viewportHeight,
    'xf':viewportWidth,
    'yf':0,
    'xii':-1,'xfi':0,
    'yii':0,'yfi':-1,
    },
  3:{ //Middle Lower, Left to right
    'duration':8000,
    'xi':0,
    'yi':viewportHeight*3/4,
    'xf':viewportWidth,
    'yf':viewportHeight*3/4,
    'xii':-1,'xfi':0,
    'yii':-0.5,'yfi':-0.5
    },
  6:{ //Middle Left, Top to Bottom
    'duration':9000,
    'xi':viewportWidth*1/4,
    'yi':0,
    'xf':viewportWidth*1/4,
    'yf':viewportHeight,
    'xii':-0.5,'xfi':-0.5,
    'yii':-1,'yfi':0
    },
  5:{ //Middle Top, Right to left
    'duration':8000,
    'xi':viewportWidth,
    'yi':viewportHeight*1/4,
    'xf':0,
    'yf':viewportHeight*1/4,
    'xii':0,'xfi':-1,
    'yii':-0.5,'yfi':-0.5
    },
  1:{ //Middle Right, Bottom to Top
    'duration':4000,
    'xi':viewportWidth*3/4,
    'yi':viewportHeight,
    'xf':viewportWidth*3/4,
    'yf':0,
    'xii':-0.5,'xfi':-0.5,
    'yii':0,'yfi':-1
    },
};

$(window).resize(function (){
  imagesNotScaled = true;
  viewportWidth = window.innerWidth;//$(document).width();
  viewportHeight = window.innerHeight;//$(document).height();
  animationSet = {
    0:{ //Top left to bottom right
      'duration':10000,
      'xi':0,'yi':0,
      'xf':viewportWidth,
      'yf':viewportHeight,
      'xii':-1,'xfi':0,
      'yii':-1,'yfi':0,
      },
    7:{ //Top right to bottom left
      'duration':7000,
      'xi':viewportWidth,
      'yi':0,
      'xf':0,
      'yf':viewportHeight,
      'xii':0,'xfi':-1,
      'yii':-1,'yfi':0,
    },
    2:{ //Bottom right to top left
      'duration':8000,
      'xi':viewportWidth,
      'yi':viewportHeight,
      'xf':0,
      'yf':0,
      'xii':0,'xfi':-1,
      'yii':0,'yfi':-1,
      },
    4:{ //Bottom left to top right
      'duration':5000,
      'xi':0,
      'yi':viewportHeight,
      'xf':viewportWidth,
      'yf':0,
      'xii':-1,'xfi':0,
      'yii':0,'yfi':-1,
      },
    3:{ //Middle Lower, Left to right
      'duration':8000,
      'xi':0,
      'yi':viewportHeight*3/4,
      'xf':viewportWidth,
      'yf':viewportHeight*3/4,
      'xii':-1,'xfi':0,
      'yii':-0.5,'yfi':-0.5
      },
    6:{ //Middle Left, Top to Bottom
      'duration':9000,
      'xi':viewportWidth*1/4,
      'yi':0,
      'xf':viewportWidth*1/4,
      'yf':viewportHeight,
      'xii':-0.5,'xfi':-0.5,
      'yii':-1,'yfi':0
      },
    5:{ //Middle Top, Right to left
      'duration':8000,
      'xi':viewportWidth,
      'yi':viewportHeight*1/4,
      'xf':0,
      'yf':viewportHeight*1/4,
      'xii':0,'xfi':-1,
      'yii':-0.5,'yfi':-0.5
      },
    1:{ //Middle Right, Bottom to Top
      'duration':4000,
      'xi':viewportWidth*3/4,
      'yi':viewportHeight,
      'xf':viewportWidth*3/4,
      'yf':0,
      'xii':-0.5,'xfi':-0.5,
      'yii':0,'yfi':-1
      },
  };
});
