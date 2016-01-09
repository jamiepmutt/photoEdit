//greeting when the page loads
//load a project window
//set up a editing window
//upload a photo
//create a way to edit the file
//way to save the picture
//canvas functionality
//Problem: no user interaction causes no change to application
//Solution: when user interacts cause changes appropriately





var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('canvasImage');
//var ctx = canvas.getContext('2d');
var color = $(".selected").css("background-color");
var $canvas = $("canvas");
var ctx = $canvas[0].getContext("2d");
var lastEvent;
var mouseDown = false;
var imgD;


var imageSaver = document.getElementById('imageSaver');
imageSaver.addEventListener('click', saveImage, false);

//save the new picture to your computer
function saveImage(e) {
    this.href = canvas.toDataURL({
        format: 'jpeg',
        quality: 1.0
    });
    this.download = 'test.png'
}

//this function allows you to pick a color that is on the canvas to match it
function pick(event) {
  //this makes it so it gets the data from the position on the canvas
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  //converts the data to a color and sends it to the add new color
  var rgba = 'rgba(' + data[0] + ',' + data[1] +
             ',' + data[2] + ',' + data[3] + ')';
  $("#newColor").css("background-color", rgba );
}
canvas.addEventListener('click', pick);


function handleImage(e){
  //uploading a photo to canvas
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
          //on load draws uploaded image to canvas and adjusts to fit canvas
            $("#resize").width = img.width;
            $("#resize").height = img.height;
//            $("#canvasImage").width = img.width;
//            $("#canvasImage").height = img.height;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.width = img.width;
            ctx.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

//When clicking on control list items
$(".controls").on("click", "li", function(){
   //Deselect sibling elements
  $(this).siblings().removeClass("selected");
  //Select clicked element
  $(this).addClass("selected");
  //Cache current color
  color = $(this).css("background-color");

});

//When new color is pressed
$("#revealColorSelect").click(function(){
  //Show color select or hide the color select
  changeColor();
  $("#colorSelect").toggle();
});

//update the new color span
function changeColor(){
  var r = $("#red").val();
  var g = $("#green").val();
  var b = $("#blue").val();
  $("#newColor").css("background-color", "rgb(" + r + "," + g + ", " + b + ")");
}

// attempt to get the canvas to adjust to picture sizes... will tinker with later
//function changeSize(){
//  var cW = $("#canvasWidth").val();
//  $canvas.css("width", cW + "px"); 
//  var cH = $("#canvasHeight").val();
//  $canvas.css("height", cH + "px");
//}



//When color sliders changes
$("input[type=range]").change(changeColor);  

//When "add color" is pressed
$("#addNewColor").click(function(){
  //Append the color to the contorls ul
  var $newColor = $("<li></li>");
  $newColor.css("background-color", $("#newColor").css("background-color"));
  $(".controls ul").append($newColor);
  //Select the new color
  $newColor.click();
});



$("#resize").resizable({ stop: function(event, ui) {
//  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 var imgD = canvas.toDataURL();
    $("canvas", this).each(function() { 
         
        $(this).attr({ width: ui.size.width, height: ui.size.height});
        
        
        // Adjusting the width or height attribute clears the canvas of
        // its contents, so you are forced to redraw.
        var img = new Image();
img.onload = function () {
         
    //redraws saved image to new canvas size
  
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
img.src = imgD;
    });
//  ctx.putImageData(imgData,0,0);
 
} });


//attempt to get the canvas to resize... didn't work, retry later
//$("#resize").resizable({
//  alsoResize: "#canvasImage",
//  alsoResize: "$canvas",
//  alsoResize: "ctx"
//});
//
//var alsoResize = $("#resize").resizable( "option", "alsoResize" );
//
//$( "#resize" ).resizable( "option", "alsoResize", "#canvasImage" );
//$( "#resize" ).resizable( "option", "alsoResize", "$canvas" );
//$( "#resize" ).resizable( "option", "alsoResize", "ctx" );
  




//On mouse events on the canvas
$canvas.mousedown(function(e){
  lastEvent = e;
  mouseDown = true;
}).mousemove(function(e){
  //Draw lines
  if (mouseDown) {
    ctx.beginPath();
    ctx.moveTo(lastEvent.offsetX, lastEvent.offsetY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = color;
    $("#width").on("input", function() {
  ctx.lineWidth = $("#width").val();
      ctx.lineCap = "round";
});
    ctx.stroke();
    lastEvent = e;
  }
}).mouseup(function(){
  mouseDown = false;
}).mouseleave(function(){
  $canvas.mouseup();
  
}); 
