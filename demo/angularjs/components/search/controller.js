import { mdiMagnify } from 'LumX/icons';

/////////////////////////////

function DemoSearchController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.icons = {
        mdiMagnify,
    };

    /**
     * The model of the search in the demo page.
     *
     * @type {Object}
     */
    vm.search = {
        model: {
            value: 'Value',
            validValue: 'Valid value',
            invalidValue: 'Invalid value',
            empty: '',
        },
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoSearchController', DemoSearchController);

/////////////////////////////

export { DemoSearchController };
