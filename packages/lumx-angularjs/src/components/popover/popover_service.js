import { COMPONENT_PREFIX, MODULE_NAME, SERVICE_PREFIX } from '@lumx/angularjs/constants/common_constants';

/////////////////////////////

function PopoverService($rootScope) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Close a given popover.
     *
     * @param {string} popoverId The popover identifier.
     */
    function closePopover(popoverId) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-popover__close`, popoverId);
    }

    /**
     * Open a given popover.
     *
     * @param {string} popoverId The popover identifier.
     * @param {Object} params    An optional object that holds extra parameters.
     */
    function openPopover(popoverId, params) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-popover__open`, popoverId, params);
    }

    /////////////////////////////

    service.close = closePopover;
    service.open = openPopover;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.popover`).service(`${SERVICE_PREFIX}PopoverService`, PopoverService);

/////////////////////////////

export { PopoverService };
