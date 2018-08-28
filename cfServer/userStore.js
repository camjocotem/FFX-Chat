var _ = require('lodash');

var connectedUsers = {};
var userConnectionManager = {};

userConnectionManager.addUser = function(user){
	connectedUsers[user.userId] = user.name;
}

userConnectionManager.getActiveUsers = function(){
	return connectedUsers;
};

userConnectionManager.removeUser = function(socket){	
	delete connectedUsers[socket.id];
	return connectedUsers;
}

module.exports = userConnectionManager;