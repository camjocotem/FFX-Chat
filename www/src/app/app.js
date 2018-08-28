    angular.module('chatApp', ['ui.router', 'ngMaterial', 'btford.socket-io'])
    	.config(function ($mdIconProvider) {
    		$mdIconProvider
    			.iconSet('action', '../assets/icon-sets/action-icons.svg', 24)
    			.iconSet('alert', '../assets/icon-sets/alert-icons.svg', 24)
    			.iconSet('av', '../assets/icon-sets/av-icons.svg', 24)
    			.iconSet('communication', '../assets/icon-sets/communication-icons.svg', 24)
    			.iconSet('content', '../assets/icon-sets/content-icons.svg', 24)
    			.iconSet('device', '../assets/icon-sets/device-icons.svg', 24)
    			.iconSet('editor', '../assets/icon-sets/editor-icons.svg', 24)
    			.iconSet('file', '../assets/icon-sets/file-icons.svg', 24)
    			.iconSet('hardware', '../assets/icon-sets/hardware-icons.svg', 24)
    			.iconSet('icons', '../assets/icon-sets/icons-icons.svg', 24)
    			.iconSet('image', '../assets/icon-sets/image-icons.svg', 24)
    			.iconSet('maps', '../assets/icon-sets/maps-icons.svg', 24)
    			.iconSet('navigation', '../assets/icon-sets/navigation-icons.svg', 24)
    			.iconSet('notification', '../assets/icon-sets/notification-icons.svg', 24)
    			.iconSet('social', '../assets/icon-sets/social-icons.svg', 24)
    			.iconSet('toggle', '../assets/icon-sets/toggle-icons.svg', 24);
    	})
    	.factory('notificationService', function ($mdToast) {
    		var notificationService = {};

    		notificationService.showToast = function (text) {
    			var toast = $mdToast.simple()
    				.content(text)
    				.hideDelay(10 * 1000)
    				.position('top right');

    			$mdToast.show(toast);
    		};

    		return notificationService;
    	})
    	.factory('screenBlockService', function ($rootScope) {
    		var screenService = {};
    		screenService.blockScreen = function () {
    			$rootScope._pageLoad = true;
    		};
    		screenService.clearScreen = function () {
    			$rootScope._pageLoad = false;
    		};
    		screenService.isBlocked = function () {
    			return $rootScope._pageLoad === true;
    		};

    		return screenService;
    	})
    	.factory('mySocket', function (socketFactory) {
    		return socketFactory();
    	})
    	.directive('scrollBottom', function ($document) {
    		return {
    			restrict: 'A',
    			scope: {
    				scrollBottom: "="
    			},
    			link: function (scope, element) {
    				scope.$watchCollection('scrollBottom', function (newValue) {
    					if (newValue) {
    						$(element).scrollTop($(element)[0].scrollHeight);
    					}
    				});
    			}
    		}
    	});
