(function (angular) {
    'use strict';
    // The main component for the application
    function MainController($scope, $element, $attrs) {

    }

    angular.module('myApp').component('mainApp', {
        templateUrl: './app/main.html',
        controller: MainController
    });

})(window.angular);