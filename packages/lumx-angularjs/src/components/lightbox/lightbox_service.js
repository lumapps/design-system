import { COMPONENT_PREFIX, MODULE_NAME, SERVICE_PREFIX } from '@lumx/angularjs/constants/common_constants';

/////////////////////////////

function LightboxService($rootScope) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Close a given lightbox.
     *
     * @param {string} lightboxId The lightbox identifier.
     */
    function closeLightbox(lightboxId) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-lightbox__close`, lightboxId);
    }

    /**
     * Open a given lightbox.
     *
     * @param {string} lightboxId The lightbox identifier.
     * @param {Object} params     An optional object that holds extra parameters.
     */
    function openLightbox(lightboxId, params) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-lightbox__open`, lightboxId, params);
    }

    /////////////////////////////

    service.close = closeLightbox;
    service.open = openLightbox;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.lightbox`).service(`${SERVICE_PREFIX}LightboxService`, LightboxService);

/////////////////////////////

export { LightboxService };
