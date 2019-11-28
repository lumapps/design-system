import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './post-block.html';

/////////////////////////////

function PostBlockController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The default props.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _DEFAULT_PROPS = {
        orientation: 'horizontal',
        theme: 'light',
    };

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has actions slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasActions = false;

    /**
     * Whether the directive has attachments slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasAttachments = false;

    /**
     * Whether the directive has author slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasAuthor = false;

    /**
     * Whether the directive has tags slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasTags = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get post block classes.
     *
     * @return {Array} The list of post block classes.
     */
    function getClasses() {
        const classes = [];

        const orientation = lx.orientation ? lx.orientation : _DEFAULT_PROPS.orientation;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;

        classes.push(`${CSS_PREFIX}-post-block--orientation-${orientation}`);
        classes.push(`${CSS_PREFIX}-post-block--theme-${theme}`);

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function PostBlockDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('actions')) {
            ctrl.hasActions = true;
        }

        if (transclude.isSlotFilled('attachments')) {
            ctrl.hasAttachments = true;
        }

        if (transclude.isSlotFilled('author')) {
            ctrl.hasAuthor = true;
        }

        if (transclude.isSlotFilled('tags')) {
            ctrl.hasTags = true;
        }
    }

    return {
        bindToController: true,
        controller: PostBlockController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            meta: '@?lxMeta',
            onClick: '&?lxOnClick',
            orientation: '@?lxOrientation',
            text: '@?lxText',
            thumbnail: '@?lxThumbnail',
            thumbnailAspectRatio: '@?lxThumbnailAspectRatio',
            title: '@?lxTitle',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            actions: '?lxPostBlockActions',
            attachments: '?lxPostBlockAttachments',
            author: '?lxPostBlockAuthor',
            tags: '?lxPostBlockTags',
        },
    };
}

/////////////////////////////

angular.module('lumx.post-block').directive('lxPostBlock', PostBlockDirective);

/////////////////////////////

export { PostBlockDirective };
