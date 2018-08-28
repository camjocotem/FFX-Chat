(function (angular) {
    "use strict";
    var pfccApp = angular.module('chatApp');

    var loggedInCheck = function (accountService) {
        if (accountService.isLoggedIn()) {
            return true;
        }

        return false;
    };

    pfccApp.config(['$urlRouterProvider', function ($urlRouterProvider) {
        // Here's an example of how you might allow case insensitive urls
        // Note that this is an example, and you may also use
        // $urlMatcherFactory.caseInsensitive(true); for a similar result.
        $urlRouterProvider.rule(function ($injector, $location) {
            //what this function returns will be set as the $location.url
            var path = $location.path(),
                normalized = path.toLowerCase();
            if (path !== normalized) {
                //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
                $location.replace().path(normalized);
            }
            // because we've returned nothing, no state change occurs
        });
    }]);

    pfccApp.config(['$stateProvider', '$urlMatcherFactoryProvider', function ($stateProvider, $urlMatcherFactoryProvider) {

        $urlMatcherFactoryProvider.strictMode(false);

        $stateProvider.state('default', {
            url: "/",
            views: {
                'primary': {
                    templateUrl: 'app/navigation/parts/_homePage.html',
                    controller: 'HomePageController'
                }
            }
        }).state('register', {
            url: "/register",
            views: {
                'primary': {
                    templateUrl: 'app/login/parts/_register.html',
                    controller: 'LoginController'
                }
            }
        }).state('login', {
            url: "/login",
            views: {
                'primary': {
                    templateUrl: 'app/login/parts/_login.html',
                    controller: 'LoginController'
                }
            }
        }).state('home', {
            url: "/home",
            views: {
                'primary': {
                    templateUrl: 'app/navigation/parts/_homePage.html',
                    controller: 'HomePageController'
                }
            }
        });
    }]);

    //    pfccApp.run(function ($rootScope, $state, accountService, $stateParams) {
    //        $rootScope.$on('$stateChangeStart', function (e, to) {
    //            if (to.data) {
    //                if (!angular.isFunction(to.data.rule)) {
    //                    return;
    //                }
    //
    //                var isAuthenticated = to.data.rule(accountService);
    //
    //                if (!isAuthenticated) {
    //                    e.preventDefault();
    //                    $state.go('login');
    //                }
    //            }
    //        });
    //    });

})(window.angular);
