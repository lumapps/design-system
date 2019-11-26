function DemoController(LumXLightboxService) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The lightbox id.
     *
     * @type {string}
     */
    vm.lightboxId = 'lightbox-demo';

    /**
     * The source button id.
     *
     * @type {string}
     */
    vm.sourceId = 'lightbox-demo-source';

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Open the lightbox.
     */
    function openLightbox() {
        LumXLightboxService.open(vm.lightboxId, {
            source: `#${vm.sourceId}`,
        });
    }

    /////////////////////////////

    vm.openLightbox = openLightbox;
}

/////////////////////////////

angular.module('design-system').controller('DemoController', DemoController);

/////////////////////////////

export { DemoController };
