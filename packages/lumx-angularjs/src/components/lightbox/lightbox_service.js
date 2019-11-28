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
        $rootScope.$broadcast('lx-lightbox__close', lightboxId);
    }

    /**
     * Open a given lightbox.
     *
     * @param {string} lightboxId The lightbox identifier.
     * @param {Object} params     An optional object that holds extra parameters.
     */
    function openLightbox(lightboxId, params) {
        $rootScope.$broadcast('lx-lightbox__open', lightboxId, params);
    }

    /////////////////////////////

    service.close = closeLightbox;
    service.open = openLightbox;
}

/////////////////////////////

angular.module('lumx.lightbox').service('LxLightboxService', LightboxService);

/////////////////////////////

export { LightboxService };
