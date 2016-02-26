(function (angular) {
    'use strict';
    EditorController.$inject = ['$scope', '$element', '$attrs', '$compile'];
    // The main component for the application
    function EditorController($scope, $element, $attrs, $compile) {
        var ctrl = this;

        var editorSelector = '.editor-container';
        var editorContainer = angular.element($element[0].querySelector(editorSelector));
        var containerLeftOffset = editorContainer.offset().left;

        // handler model update
        ctrl.update = function() {
            console.log('update from editor');
        };

        ctrl.onDropHandler = function(event, ui) {
            var offset = ui.offset;

            // decide what diagram to add to the dom
            switch (ui.draggable[0].id) {
                case "entity":
                    console.log("Adding new entity to the editor");
                    ctrl.addNewEntity(offset);
                    break;
                default:
                    console.log("No handler for this dropped object.");
            }
        }

        ctrl.addNewEntity = function(offset) {
            angular.element($compile('<er-entity on-update="$ctrl.update()"></er-entity>')($scope))
                .css({position: 'absolute', top: offset.top, left: offset.left - containerLeftOffset})
                .appendTo(editorContainer);
        }
    }

    angular.module('editor').component('editor', {
        templateUrl: './app/components/editor/editor.html',
        controller: EditorController
    });

})(window.angular);