(function (angular) {
	'use strict';
	angular.module('myApp').controller('JsonViewerModalCtrl', function ($scope, $uibModalInstance, data) {
		$scope.data = data;

		// export json data
		// copied from http://bgrins.github.io/devtools-snippets/#console-save
		$scope.export = function () {
			if (!$scope.data) {
				return;
			}

			var data = $scope.data;
			var filename = 'schema.json';

			if (typeof data === 'object') {
				data = JSON.stringify(data, null, 2);
			} else {
				return;
			}

			var blob = new Blob([data], {type: 'text/json'}),
				e = document.createEvent('MouseEvents'),
				a = document.createElement('a');

			a.download = filename;
			a.href = window.URL.createObjectURL(blob);
			a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
			e.initEvent('click', true, false, window,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		};

		$scope.ok = function () {
			$uibModalInstance.close();
		};
	});

})(window.angular);