function TableBodyController() {
    'ngInject';

    const lx = this;
}

/////////////////////////////

function TableBodyDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableBodyController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {},
        template: '<tbody ng-transclude></tbody>',
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.table').directive('lxTableBody', TableBodyDirective);

/////////////////////////////

export { TableBodyDirective };
