import { mdiReact } from 'LumX/icons';

import template from './main-header.html';

/////////////////////////////

function mainHeaderController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The checkbox icons.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiReact,
    };
}

/////////////////////////////

function mainHeaderDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: mainHeaderController,
        controllerAs: 'vm',
        replace: true,
        restrict: 'E',
        scope: {
            category: '@',
            title: '@',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('design-system').directive('mainHeader', mainHeaderDirective);

/////////////////////////////

export { mainHeaderDirective };
