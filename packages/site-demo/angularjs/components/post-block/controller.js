import { mdiComment, mdiHeart } from '@lumx/icons';

/////////////////////////////

function DemoPostBlockController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The post block icons.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiComment,
        mdiHeart,
    };

    /**
     * The post block thumbnail.
     *
     * @type {Object}
     */
    vm.postBlock = {
        meta: "1 day ago in community's name",
        tags: ['tag1', 'tag2', 'tag3'],
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus libero aliquet pharetra luctus. Fusce nisl turpis, posuere ac tellus at, euismod vulputate libero...',
        thumbnail: 'https://picsum.photos/800/600/?random',
        thumbnailAspectRatio: 'horizontal',
        title: 'Annual Bonus Payments',
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoPostBlockController', DemoPostBlockController);

/////////////////////////////

export { DemoPostBlockController };
