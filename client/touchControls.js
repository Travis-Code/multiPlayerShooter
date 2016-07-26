//NEED TO REFACTOR NOT DRY!

var upButtonDivPressed = document.getElementById("upButtonDiv-pressed");
var leftButtonDivPressed = document.getElementById("leftButtonDiv-pressed");
var rightButtonDivPressed = document.getElementById("rightButtonDiv-pressed");
var downButtonDivPressed = document.getElementById("downButtonDiv-pressed");

//up button test


$(function(){
  $(upButtonDivPressed).bind( "taphold", tapholdHandler );
 
  function tapholdHandler( event ){
    $( event.target ).addClass( "taphold" );
  }
});

	// var myDiv = document.getElementById('foo');

	// myDiv.onmouseover = function() { 
	//     alert('entered');
	// }

	// myDiv.onmouseout = function() { 
	//     alert('left');
	// }

// <h1 id="demo" onmouseover="mouseOver()" onmouseout="mouseOut()">Mouse over me</h1>



   // var can = document.getElementById("map-canvas");

   //  var mc = new Hammer.Manager(can);

   //  mc.add(new Hammer.Press({
   //      event: 'press',
   //      pointer: 1,
   //      threshold: 5,
   //      time: 2500

   //  }));

   //  mc.on('press', function (event) {
   //      createLocation(el);
   //  });





// mouseenter, mouseleave, mouseover, mouseout or mousemove.




	upButtonDivPressed.onmouseenter = function(event) {
			event.preventDefault();
			console.log("up");
		   	socket.emit('keyPress',{inputId:'up',state:true});	
	}

	upButtonDivPressed.onmouseleave = function(event) {
			event.preventDefault();
			console.log("up let go");
		   	socket.emit('keyPress',{inputId:'up',state:false});	
	}

	leftButtonDivPressed.onmouseenter = function(event) {
			event.preventDefault();
			console.log("left pushed");
		   	socket.emit('keyPress',{inputId:'left',state:true});	
	}

	leftButtonDivPressed.onmouseleave = function(event) {
			event.preventDefault();
			console.log("left let go");
		   	socket.emit('keyPress',{inputId:'left',state:false});	
	}

	rightButtonDivPressed.onmouseenter = function(event) {
			event.preventDefault();
			console.log("right pushed");
		   	socket.emit('keyPress',{inputId:'right',state:true});	
	}

	rightButtonDivPressed.onmouseleave = function(event) {
			event.preventDefault();
			console.log("right let go");
		   	socket.emit('keyPress',{inputId:'right',state:false});	
	}

	downButtonDivPressed.onmouseenter = function(event) {
			event.preventDefault();
			console.log("down pushed");
		   	socket.emit('keyPress',{inputId:'down',state:true});	
	}

	downButtonDivPressed.onmouseleave = function(event) {
			event.preventDefault();
			console.log("down let go");
		   	socket.emit('keyPress',{inputId:'down',state:false});	
	}



