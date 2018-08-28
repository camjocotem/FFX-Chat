(function () {
    'use strict';

    angular
        .module('chatApp')
        .factory('app_env', function app_env() {
            return {
                baseUrl: 'http://localhost:3000/api'
            };
        });
})(window.angular);
