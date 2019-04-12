import template from './demo-grid.html';

/////////////////////////////

function demoGridDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('design-system').directive('demoGrid', demoGridDirective);

/////////////////////////////

export { demoGridDirective };
