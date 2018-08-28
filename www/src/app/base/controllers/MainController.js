(function () {
	'use strict';
	var chatApp = angular.module('chatApp');

	chatApp.controller('MainController', ['$scope', 'mySocket', function ($scope, mySocket, $mdDialog) {

		$scope.user = {};
		
		function notifyMe(user, message) {
			if (Notification.permission !== "granted")
				Notification.requestPermission();
			else {
				var notification = new Notification('New Message', {
					icon: 'http://images2.wikia.nocookie.net/__cb20101204213455/finalfantasy/images/9/9d/Psyches.jpg',
					body: user + ": " + message
				});
			}
		}

		mySocket.on('chat message', function (msg) {
			$scope.chatMessages.push(msg);
			if (msg.user.userId !== $scope.user.userId) {
				notifyMe(msg.user.name, msg.content);
			}
		});

		mySocket.on('user connection', function (userList) {
			console.log("Updated userlist", userList);
			$scope.connectedUsers = userList;
		});
		
		mySocket.on('connection id', function(connectionId){
			$scope.user.userId = connectionId;
		});
		
		mySocket.on('user disconnected', function(userList){
			console.log("Updated userlist", userList);
			$scope.connectedUsers = userList;						
		});
		
		mySocket.on('test', function(res){
			console.log("Test", res);
		});

		var dialogScope = $scope.$new();
		dialogScope.name = "";
		dialogScope.save = function (nameForm) {
			if (nameForm.$valid) {				
				$scope.user.name = dialogScope.name;
				mySocket.emit('user connection', $scope.user);
				$mdDialog.hide();
			}
		}
		
		$scope.$watch('connectedUsers', function(n,o){
			debugger;
			console.log("New", n);
			console.log("Old", o);
		}, true);
		
		$mdDialog.show({
			scope: dialogScope,
			parent: angular.element(document.body),
			template: '<md-dialog aria-label="Name dialog">' +
				'   <form name="NameForm">' +
				'	<md-toolbar>' +
				'		<div class="md-toolbar-tools">' +
				'			<h2>What is your name?</h2>' +
				'		</div>' +
				'	</md-toolbar>' +
				'  <md-dialog-content>' +
				'    <input type="text" ng-model="name" required/>' +
				'    <button type="submit" ng-click="save(NameForm)">' +
				'      Accept' +
				'    </button>' +
				'  </md-dialog-content>' +
				'  </form>' +
				'</md-dialog>',
		}).then(function (answer) {
			dialogScope.$destroy();
		}, function () {
			dialogScope.$destroy();
		});

		$scope.chatMessages = [];

		$scope.sendChatMessage = function (chatMessage, e) {
			var messagePayload = {};
			messagePayload.content = chatMessage;
			messagePayload.timestamp = new Date().toISOString();
			messagePayload.user = $scope.user;

			if (chatMessage && e && e.key === "Enter") {
				mySocket.emit('chat message', messagePayload);
				$scope.chatMessage = "";
			}
			if (chatMessage && !e) {
				mySocket.emit('chat message', messagePayload);
				$scope.chatMessage = "";
			}
		}

    }]);
})(window.angular);
