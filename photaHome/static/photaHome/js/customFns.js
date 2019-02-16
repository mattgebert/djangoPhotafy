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

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) || ((elemBottom >= docViewBottom) && (elemTop <= docViewTop));
}
function isScrolledFullyIntoViewOpts(elem,offsetTop,offsetBottom)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top - offsetTop;
    var elemBottom = elemTop + $(elem).height() - offsetBottom;

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) || ((elemBottom >= docViewBottom) && (elemTop <= docViewTop));
}
function isScrolledIntoViewOpts(elem,offsetTop,offsetBottom)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top - offsetTop;
    var elemBottom = elemTop + $(elem).height() - offsetBottom;

    return ((docViewTop >= elemTop) && (docViewTop <= elemBottom)) || ((docViewBottom >= elemTop) && (docViewBottom <= elemBottom));
}


//Custom Written Function to scroll page to a specific element.
function scrollTillTop(elem, container) {

  var docViewTop = $(container).scrollTop();
  var elemTop = $(elem).offset().top;
  var initDiff = Math.ceil(elemTop + docViewTop);

  $(container).animate({scrollTop:[initDiff,'swing']}, 500);
}

//Custom Written Function to scroll page to a specific element with options.
function scrollTillTopOpts(elem, container,offset,ms) {

  var docViewTop = $(container).scrollTop();
  var elemTop = $(elem).offset().top;
  var initDiff = Math.ceil(elemTop + docViewTop - offset);

  $(container).animate({scrollTop:[initDiff,'swing']}, ms);
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
