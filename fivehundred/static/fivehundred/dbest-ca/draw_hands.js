   function fillHand(itemID,order,cards) {
    var text = "<div class=\"playingCards simpleCards faceCards rotateHand\">";
    text += "<ul class=\"hand\">";

    for (var i = 0, len = order.length; i < len; i++) {
      var CARDS;
      if(order[i] == 'H'){ CARDS = cards.H; suit = "hearts"; suitSym = "&hearts;"; other="diams"; otherSym="&diams;" }
      if(order[i] == 'D'){ CARDS = cards.D; suit = "diams"; suitSym = "&diams;"; other = "hearts"; otherSym="&hearts;" }
      if(order[i] == 'S'){ CARDS = cards.S; suit = "spades"; suitSym = "&spades;"; other = "clubs"; otherSym="&clubs;"; }
      if(order[i] == 'C'){ CARDS = cards.C; suit = "clubs"; suitSym = "&clubs;"; other = "spades"; otherSym="&spades;" }
      var up = 0;
      for(var j = 0, len2 = CARDS.length ; j < len2; j++) { 
        c = CARDS[j];
        var rank;
        var my_suit = suit;
        var my_suit_sym = suitSym;
        if(c == "^") { up = 1; continue; }
        if(c == "X") {
          text += "<li> <a class=\"card back\">*</a> </li>";
          continue;
        }
        if(c == "T") { rank = "10"; }
        else if(c == "j") { rank = "J"; my_suit = other; my_suit_sym = otherSym; }
        else { rank = c; }
        text += "<li>";
        if(up == 1){ text += "<strong>"; }
        text += "<a class=\"card rank-" + rank + " " + my_suit + "\"> <span class=\"rank\">" + rank + "</span>     <span class=\"suit\">" + my_suit_sym + "</span>      </a></li>";
        if(up == 1){ text += "</strong>"; }
        text += "</li>";
      }
      up = 0; // Reset if the cards are up
    }

    if(cards.J.length == 1){
      text += "<li> <a class=\"card little joker\">      <span class=\"rank\">-</span>     <span class=\"suit\">Joker </span>        </a></li>";
    }

    text += "</ul></div>";

    document.getElementById(itemID).innerHTML = text;
   }


function drawTable() {
var text = "";
text += "<table style=\"border-spacing: 10px; border-collapse: separate;\">";
text += "<tr><td width=\"250px\"></td><td width=\"250px\"> <div id=\"north\"></div> </td><td width=\"250px\"></td></tr>";
text += "<tr><td>  <div id=\"west\"></div> </td><td><img src=\"../nesw.jpg\"></img></td><td>  <div id=\"east\"></div>  </td></tr>";
text += "<tr><td></td><td> <div id=\"south\"></div> </td><td></td></tr>";
text += "</table>";

document.getElementById("card-table").innerHTML = text;
}

