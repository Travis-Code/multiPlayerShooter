var express = require("express");
var app = express();
//create a server.
var serv = require("http").Server(app);
app.get('/', function(req,res){
	res.sendFile(__dirname+'/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
serv.listen(3000);
	console.log("Server Started on port 3000");

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var Player_Names = {};
var numberOfUsers =0;

var Player = function(id){
	var self = {
		x:250,
		y:250,
		id:id,
		canvasWidth:580,
		//number:"" + Math.floor(10*Math.random()),
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		pressingDown:false,
		maxSpd:10,
		username:"",
	}


	self.updatePosition = function(){
		if(self.pressingRight){
			self.x += self.maxSpd;
		}
		if(self.pressingLeft)
			self.x -= self.maxSpd;
		if(self.pressingUp)
			self.y -= self.maxSpd;
		if(self.pressingDown)
			self.y += self.maxSpd;
	}
	return self;
}

var io = require("socket.io")(serv,{});
io.sockets.on('connection', function(socket){         
	var addedUser = false;                                  
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	console.log(" User Number " + socket.id + " has CONNECTED" );

	var player = Player(socket.id)
	PLAYER_LIST[socket.id] = player;

	socket.on("disconnect", function(){
		console.log(" User Number " + socket.id + " has DISCONNECTED" );
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];

	});

	socket.on('signIn', function(username){
		if(addedUser) return;
		player.username = username;
		console.log(player.username);
		++numberOfUsers;
		addedUser = true;

		Player_Names[player.username] = username;
		console.log(" User " + player.username + " has signed in" );
		socket.emit('signInResponse', {success:true});
	});

	//chat
	socket.on("sendMsgToServer", function(data){
		// var playerName = (""+ player.username  + socket.id);
		var playerName = (""+ player.username);
		for(var i in SOCKET_LIST){
			// SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
			SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);

		}
	});

	socket.on('collidedWall',function(data){
		if(data.inputId === 'boom' && player.pressingRight ===true){
			player.pressingRight = false;
		}
	});

	socket.on('keyPress', function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
	});
});

setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.updatePosition();
		pack.push({
			x:player.x,
			y:player.y,
		});
	}

	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit("newPosition",pack);
	}

},1000/25);