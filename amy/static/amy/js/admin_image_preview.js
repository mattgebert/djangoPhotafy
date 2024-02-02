var previewImage;
var attached = false;

function followMouse(event) {
  previewImage.style.left = event.x + "px";
  previewImage.style.top = event.y + "px";
}

function imagePreview(event) {
  console.log("hover on");
  // console.log(event.target.attributes.src)
  // console.log(event.target.dataset)
  var src = event.target.attributes.src.value;
  console.log(src)
  if (!attached) {
    // previewImage = $("body").append("<img id='previewImage' src="+src+" width=400px />");
    previewImage = django.jQuery("body").append("<img id='previewImage' src="+src+" width=400px />");
    attached=true;
    console.log(previewImage)
    document.addEventListener("pointermove", followMouse);
  }
}

function imageRemove(event) {
  console.log("hover off");
  attached=false;
  document.removeEventListener('pointermove', followMouse);
  previewImage.delete();
}

// $('.field-image_tag_icon img').hover(imagePreview, imageRemove);
// $('td p img').hover(imagePreview, imageRemove);
if (window.jQuery) {
  console.log("jQuery loaded");
} else {
  console.log("Oh no jQuery");
}

$(document).ready(function() {
  django.jQuery('img').hover(imagePreview, imageRemove);
  // $('img').hover(imagePreview, imageRemove);
  console.log("Running script and binding");
})
