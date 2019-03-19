import { mdiReact } from 'LumX/icons';

import template from './main-header.html';

/////////////////////////////

function mainHeaderController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const mainHeader = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The main header icons.
     *
     * @type {Object}
     */
    mainHeader.icons = {
        mdiReact,
    };
}

/////////////////////////////

function mainHeaderDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: mainHeaderController,
        controllerAs: 'mainHeader',
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
