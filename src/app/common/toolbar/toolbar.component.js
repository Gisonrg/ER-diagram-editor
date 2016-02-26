(function (angular) {
    'use strict';
    // The main component for the application
    function ToolbarController($scope, $element, $attrs) {

    }

    angular.module('toolbar').component('toolbar', {
        templateUrl: './app/common/toolbar/toolbar.html',
        controller: ToolbarController
    });

})(window.angular);