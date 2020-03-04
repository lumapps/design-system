import { mdiDotsVertical, mdiHeart, mdiReply } from '@lumx/icons';

function DemoController(LxNotificationService) {
    'ngInject';

    const vm = this;

    /**
     * The comments.
     *
     * @type {Array}
     */
    vm.comments = [
        {
            date: '4 hours ago',
            name: 'Matthias Manoukian',
            text:
                'All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation.',
            isOpen: false,
        },
    ];
    vm.commentsThreaded = [
        {
            date: '4 hours ago',
            name: 'Matthias Manoukian',
            text:
                'All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation.',
            isOpen: true,
            children: [
                {
                    date: '3 hours ago',
                    name: 'Jackson Ray',
                    text: 'Here, I focus on a range of items and features that we use in life without giving them.',
                },
                {
                    date: '2 hours ago',
                    name: 'Hettie Powell',
                    text: 'Differentiate and you stand out in a crowded marketplace.',
                },
            ],
        },
    ];

    /**
     * The comment block icons.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiDotsVertical,
        mdiHeart,
        mdiReply,
    };

    /**
     * Callback on user block click.
     */
    function onClick() {
        LxNotificationService.success('Click callback');
    }

    /**
     * Callback on user block mouse enter.
     */
    function onMouseEnter() {
        LxNotificationService.success('Mouse enter callback');
    }

    /**
     * Callback on user block mouse leave.
     */
    function onMouseLeave() {
        LxNotificationService.success('Mouse leave callback');
    }

    vm.onClick = onClick;
    vm.onMouseEnter = onMouseEnter;
    vm.onMouseLeave = onMouseLeave;
}

angular.module('design-system').controller('DemoController', DemoController);

export { DemoController };
