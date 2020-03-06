function TableHeadController() {
    'ngInject';

    const lx = this;
}

/////////////////////////////

function TableHeadDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableHeadController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {},
        template: '<thead ng-transclude></thead>',
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.table').directive('lxTableHead', TableHeadDirective);

/////////////////////////////

export { TableHeadDirective };
