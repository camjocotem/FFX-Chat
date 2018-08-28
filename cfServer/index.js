var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var logger = require('morgan');
var io = require('socket.io')(http);
var env = require('node-env-file');
var translator = require('./chatFuscator');
var userManager = require('./userStore');

env(__dirname + '/../.env');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', express.static('../www/src/'));

io.sockets.on('connection', function(socket){
    console.log("A user connected", socket.id + 'user connected !');		
	io.sockets.to(socket.id).emit('connection id', socket.id);
	io.sockets.emit('test', 'TEST');
    
    socket.on('chat message', function(msgPayload){        				
		msgPayload.content = translator.toAlBhed(msgPayload.content);		
		msgPayload.user.name = translator.toAlBhed(msgPayload.user.name);
        io.sockets.emit('chat message', msgPayload);
    });
	
	socket.on('user connection', function(user){
		userManager.addUser(user);
		io.sockets.emit('user connection', userManager.getActiveUsers());
	});
    
    socket.on('disconnect', function(){		
		var socketList = io.sockets.server.eio.clients;
		var remainingUsers = userManager.removeUser(socket);				
		io.sockets.emit('user disconnected', remainingUsers);
    });
});

http.listen(process.env.PORT, function(){
    console.log("Listening on port ", process.env.PORT);
});