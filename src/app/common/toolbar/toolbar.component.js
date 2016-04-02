(function (angular) {
	'use strict';
	// The main component for the application
	function ToolbarController($scope, $element, $attrs, $sessionStorage) {
		var ctrl = this;
		$scope.token = $sessionStorage.get('token');

		if ($scope.token) {
			$scope.hasLogin = true;
		} else {
			$scope.hasLogin = false;
		}

		$scope.$on('user:login', function() {
			$scope.token = $sessionStorage.get('token');
			$scope.hasLogin = true;
		});

		$scope.userData = {
			email: '',
			password: ''
		}

		ctrl.login = function(valid) {
			if (!valid) {
				return;
			}
			ctrl.onLogin({
				email: $scope.userData.email,
				password: $scope.userData.password
			});
			$scope.userData = {
				email: '',
				password: ''
			}
		};

		ctrl.signup = function(valid) {
			if (!valid) {
				return;
			}
			ctrl.onSignup({
				email: $scope.userData.email,
				password: $scope.userData.password
			});
			$scope.userData = {
				email: '',
				password: ''
			}
		};

		ctrl.logout = function() {
			$scope.hasLogin = false;
			$sessionStorage.remove('token');
			ctrl.onLogout();
		}
	}

	angular.module('toolbar').component('toolbar', {
		bindings: {
			onGenerate : '&',
			onClearData: '&',
			onLoadData: '&',
			onSaveData: '&',
			onLogin: '&',
			onSignup: '&',
			onLogout: '&'
		},
		templateUrl: './app/common/toolbar/toolbar.html',
		controller: ToolbarController
	});

})(window.angular);