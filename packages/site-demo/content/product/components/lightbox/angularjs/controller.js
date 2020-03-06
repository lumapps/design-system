export function DemoController(LxLightboxService) {
    'ngInject';

    const vm = this;

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

    /**
     * The list of tags.
     *
     * @type {Array}
     */
    vm.tags = ['Tag 1', 'Tag 2'];

    /**
     * Open the lightbox.
     */
    function openLightbox() {
        LxLightboxService.open(vm.lightboxId, {
            source: `#${vm.sourceId}`,
        });
    }

    vm.openLightbox = openLightbox;
}

angular.module('design-system').controller('DemoController', DemoController);
