//Scrolling Functions:
$(".parallax").scroll(function() {
    //Scrolling Fading for scroll-img

        //For static subpage, do nothing for scolled to top.
        // if($(this).scrollTop() > 20){
            $('div#ban-height').css("max-height","48px").css("width","");//.removeClass("col-md-3").addClass("col-md-6")
            $('div#ban-container').addClass("sticky");
            $('div#top-buttons').fadeOut(100, function(){
                $("#nav-button-container").appendTo("#nav-buttons");
                $('div#nav-buttons').fadeIn(600);
            })
        // } else {
        //     $('div#nav-buttons').fadeOut(100,function(){
        //         //In case we want to sequence fadeout and stretch rather than run parallel.
        //         $("#nav-button-container").appendTo("#top-buttons");
        //         $("#top-buttons").fadeIn(600);
        //     });
        //     $('div#ban-container').removeClass("sticky");
        //     $('div#ban-height').css("max-height","150px").css("width","100%");//.removeClass("col-md-6").addClass("col-md-3")
        //     $('div#top-buttons').css("max-height","100px");
        // }
 });

//BIND SCROLLING ON BANNER TO PARALLAX CONTAINER:
$('div#ban-container').bind('mousewheel', function(e){
    var scrollTo = (e.deltaY*e.deltaFactor*-1) + $('.parallax').scrollTop();
    $(".parallax").scrollTop(scrollTo);
});

/*$(window).scroll(function(e){
    //TODO: Get scrolling working for keydown events.
    var scrollTo= (e.deltaY*e.deltaFactor*-1) + $('.parallax').scrollTop();
    $(".parralax").scrollTop(scrollTo);
});*/


var imgHeight;
var imgWidth;

$(document).ready(function(){
    //1 - Resize Events:
    imgHeight = document.getElementById('scroll-img1').naturalHeight;
    imgWidth =  document.getElementById('scroll-img1').naturalWidth;
    $(window).resize();

    //Adds start up functions.
    //2 - Set Banner Width to Parallax Width
    //3 - Transition Top Bar upon load.
    $(".parallax").scroll();
    // $('div#nav-buttons').fadeOut(300,"swing",function() {
    //     //At fadeout, make element visible again.
    //     $(this).css("display","auto");
    // });
    //THIS THROWS OFF WINDOW HEIGHT SO MUCH HAHAHAHA... TODO: Fix height of back div.
    //alert($(".parallax")[0].scrollHeight);
    //alert($(".parallax_layer_front")[0].scrollHeight);
    //$(".parallax_layer_back").css('height',($(".parallax_layer_front")[0].scrollHeight + $(window).height()));

    //4 - Match Div Columns to be same height:
    //matchHeightCustom('.service');
});

$(window).resize(function (){
    //Handler for resize event of window.
    //1: Fix Scrollbar Hiehgts
    var width = $(window).width() - getScrollbarWidth();
    var height = $(window).height();
    $('div#ban-container').css('width',width);
    if(width > height) {
        if(width < 1100)  {
            $('div.menu-item span').css('font-size',7+width/(200)).css('display','none');
        } else {
            $('div.menu-item span').css('font-size',7+width/(200)).css('display','');
        }
    } else {
        if(width < 1100)  {
            $('div.menu-item span').css('font-size',7+height/(200)).css('display','none');
        } else {
            $('div.menu-item span').css('font-size',7+height/(200)).css('display','');
        }
    }

    //2: Resize heights of columns to match.
    matchHeightCustom('.service');

    //Attempt at scaling background image.
    /*var scale = width/imgWidth;//Math.sqrt(scale) * imgHeight/2
    var string = 'rect('+0+ 'px,'+Math.round((1-0.4*scale)*imgWidth)+'px,'+imgHeight+'px,'+Math.round(0.4*(scale)*imgWidth)+'px)';
    alert(string);
    if(scale<1){
        $('#scroll-img1').css('clip',string); //Top,Right,Bottom,Left
    }
    */
});

// MAPS Styling! :D
mapstyles = [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ];

/*-----------------------------------------------------EXTERNAL FUNCTIONS-----------------------------------------------------*/
/*Get the width of a random scrollbar, to deal with the oversize banner.
Credit from source: http://stackoverflow.com/questions/13382516/
*/
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

/*Check if selected item is in the view-field or not.
Credit from source: http://stackoverflow.com/questions/487073/
*/
function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

//Custom Written Function to match heights of columned elements of a class.
function matchHeightCustom(elem)
{
    //1 Reset to default heights:
    $(elem).each(function(){
        $(this).css('height','auto');
    });
    //2 Find maximum height:
    var maxHeight = 0;
    $(elem).each(function(){
        var elementHeight = ($(this).css('height').replace(/[^-\d\.]/g, ''));
        if (maxHeight < elementHeight) {
            maxHeight = elementHeight;
        }
    });
    //3 Set all heights to maximum height:
    $(elem).each(function(){
        $(this).css('height',maxHeight.concat('px'));
    });
}



//DEBUGGING SCRIPT FOR Z Scales
//var debugInput = document.querySelector("input");
//function updateDebugState() {
//    document.body.classList.toggle('debug-on', debugInput.checked);
//}
//debugInput.addEventListener("click", updateDebugState);
//updateDebugState();
