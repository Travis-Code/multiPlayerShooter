var express = require("express");
var app = express();
// var mongo = mongodb;
// var mongoose = mongoose();
//create a server.
var serv = require("http").Server(app);
app.get('/', function(req,res){
	res.sendFile(__dirname+'/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
serv.listen(process.env.PORT || 3000);
	console.log("Server Started on port 3000");




var SOCKET_LIST = {};
var PLAYER_LIST = {};
var Player_Names = {};
var numberOfUsers =0;
var collision = false;


// var Entity = 

//PLAYER OBJECT-----------------------------------------------------
var Player = function(id){
	var self = {
		x:250,
		y:250,
		id:id,
		canvasWidth:640,
		canvasHeight:380,
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		pressingDown:false,
		maxSpd:10,
		username:"",
		hitWall: false,
		hitRightWall:true,
	}

	self.updatePosition = function(){
		if(self.pressingRight)
			self.x += self.maxSpd;
		if(self.pressingLeft)
			self.x -= self.maxSpd;
		if(self.pressingUp)
			self.y -= self.maxSpd;
		if(self.pressingDown)
			self.y += self.maxSpd;
		
		// //collide with walls
		// if(self.x >= self.canvasWidth-50)
		// 	self.x = self.canvasWidth-50;
		// if(self.x <= 0)
		// 	self.x = 0;
		// if(self.y >= self.canvasHeight-50)
		// 	self.y = self.canvasHeight-50;
		// if(self.y <= 0)
		// 	self.y = 0;
	}

	self.collideWithWalls = function(){
		if(self.x >= self.canvasWidth-50)
			self.x = self.canvasWidth-50;
		if(self.x <= 0)
			self.x = 0;
		if(self.y >= self.canvasHeight-50)
			self.y = self.canvasHeight-50;
		if(self.y <= 0)
			self.y = 0;
	}
	return self;
}


//ON CONNECT--------------------------------------------------------
var io = require("socket.io")(serv,{});
io.sockets.on('connection', function(socket){         
	var addedUser = false;                                  
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	console.log(" User Number " + socket.id + " has CONNECTED" );
	//create new player on socket connection
	var player = Player(socket.id)
	PLAYER_LIST[socket.id] = player;
	//destroy data on disconnect
	socket.on("disconnect", function(){
		console.log(" User Number " + socket.id + " has DISCONNECTED" );
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		delete Player_Names[player.username];
	});


//CHAT----------------------------------------------------------------
	//sign in get nickname
	socket.on('signIn', function(username){
		if(addedUser) return;
		player.username = username;
		//console.log(player.username);
		++numberOfUsers;
		console.log(numberOfUsers + " users online atm");
		addedUser = true;
		Player_Names[player.username] = username;
		console.log(" User " + player.username + " has signed in" );
		socket.emit('signInResponse', {success:true});
	});

	//watch for then emit nickname and message
	socket.on("sendMsgToServer", function(data){
		var playerName = (""+ player.username);
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
		}
	});

//KEYPRESSES-----------------------------------------------------------
	socket.on('keyPress', function(data){
		if(data.inputId === 'left'){
			player.pressingLeft = data.state;
		}
		else if(data.inputId === 'right'){
			player.pressingRight = data.state;
		}
		else if(data.inputId === 'up'){
			player.pressingUp = data.state;
		}
		else if(data.inputId === 'down'){
			player.pressingDown = data.state;
		}
	});
});

//UPDATE POSITION-------------------------------------------------------
setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.collideWithWalls();
		player.updatePosition();

		pack.push({
			x:player.x,
			y:player.y,
		});
	}

	var namePack = [];
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];

		namePack.push({
			username:""+ socket.username,
		});

		socket.emit("newPosition",pack);
		socket.emit("nameOver", namePack);
	}

},1000/25);