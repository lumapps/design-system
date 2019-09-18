import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiImagePlus } from 'LumX/icons';

import template from './editable-media.html';

/////////////////////////////

function EditableMediaController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The editable media icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiImagePlus,
    };
}

/////////////////////////////

function EditableMediaDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: EditableMediaController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            helper: '@?lumxHelper',
            image: '@?lumxImage',
            label: '@?lumxLabel',
            onClick: '&?lumxOnClick',
            placeholder: '@?lumxPlaceholder',
            size: '@?lumxSize',
            variant: '@?lumxVariant',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.editable-media`).directive(`${COMPONENT_PREFIX}EditableMedia`, EditableMediaDirective);

/////////////////////////////

export { EditableMediaDirective };
