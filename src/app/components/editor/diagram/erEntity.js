function EntityController($scope, $element, $attrs) {
    var ctrl = this;

    this.name = 'test';

    this.$onInit = function () {
        // add handler
        angular.element($element).draggable({
            drag: function (event, ui) {
                console.log('dragging');
            }
        });
    };
}

angular.module('editor').component('erEntity', {
    bindings: {
        entity: '<',
        onUpdate: '&'
    },
    templateUrl: './app/components/editor/diagram/erEntity.html',
    controller: EntityController
});