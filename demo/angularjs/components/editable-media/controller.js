import { mdiDelete, mdiEye, mdiPencil } from 'LumX/icons';

/////////////////////////////

function DemoEditableMediaController(LumXLightboxService) {
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
        mdiDelete,
        mdiEye,
        mdiPencil,
    };

    /**
     * The editable media image.
     *
     * @type {string}
     */
    vm.image = undefined;

    /**
     * The lightbox id.
     *
     * @type {string}
     */
    vm.lightboxId = 'editable-media-demo';

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Handle editable media click.
     */
    function handleClick() {
        if (angular.isUndefined(vm.image)) {
            vm.image = 'https://picsum.photos/400/400/?random';
        } else {
            vm.openLightbox();
        }
    }

    /**
     * Open image in lightbox.
     */
    function openLightbox() {
        LumXLightboxService.open(vm.lightboxId);
    }

    /**
     * Remove image on delete button click.
     */
    function removeImage() {
        vm.image = undefined;
    }

    /////////////////////////////

    vm.handleClick = handleClick;
    vm.openLightbox = openLightbox;
    vm.removeImage = removeImage;
}

/////////////////////////////

angular.module('design-system').controller('DemoEditableMediaController', DemoEditableMediaController);

/////////////////////////////

export { DemoEditableMediaController };
