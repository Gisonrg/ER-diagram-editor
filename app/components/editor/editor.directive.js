(function (angular) {
	'use strict';
	angular.module('editor').directive('repeatHook', function($timeout) {
		return function(scope, element, attrs) {
			if (scope.$last) { // all are rendered
				$timeout(function(){
					scope.$emit('attr:done');
				}, 0);
			}
			scope.$on('$destroy', function(){
				scope.$emit('attr:remove');
			});
		};
	});
})(window.angular);