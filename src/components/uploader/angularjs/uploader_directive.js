import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './uploader.html';

/////////////////////////////

function UploaderController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function UploaderDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: UploaderController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.uploader`).directive(`${COMPONENT_PREFIX}Uploader`, UploaderDirective);

/////////////////////////////

export { UploaderDirective };
