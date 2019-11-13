import { CSS_PREFIX } from '@lumx/core/src/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './post-block.html';

/////////////////////////////

function PostBlockController() {
    // eslint-disable-next-line consistent-this
    const lumx = this;

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
    lumx.hasActions = false;

    /**
     * Whether the directive has attachments slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasAttachments = false;

    /**
     * Whether the directive has author slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasAuthor = false;

    /**
     * Whether the directive has tags slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasTags = false;
}

/////////////////////////////

function PostBlockDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        const defaultProps = {
            orientation: 'horizontal',
            theme: 'light',
        };

        if (!attrs.lumxOrientation) {
            el.addClass(`${CSS_PREFIX}-post-block--orientation-${defaultProps.orientation}`);
        }

        attrs.$observe('lumxOrientation', (orientation) => {
            if (!orientation) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*post-block--orientation-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-post-block--orientation-${orientation}`);
        });

        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-post-block--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*post-block--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-post-block--theme-${theme}`);
        });

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
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            meta: '@?lumxMeta',
            onClick: '&?lumxOnClick',
            orientation: '@?lumxOrientation',
            text: '@?lumxText',
            thumbnail: '@?lumxThumbnail',
            thumbnailAspectRatio: '@?lumxThumbnailAspectRatio',
            title: '@?lumxTitle',
            theme: '@?lumxTheme',
        },
        template,
        transclude: {
            actions: `?${COMPONENT_PREFIX}PostBlockActions`,
            attachments: `?${COMPONENT_PREFIX}PostBlockAttachments`,
            author: `?${COMPONENT_PREFIX}PostBlockAuthor`,
            tags: `?${COMPONENT_PREFIX}PostBlockTags`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.post-block`).directive(`${COMPONENT_PREFIX}PostBlock`, PostBlockDirective);

/////////////////////////////

export { PostBlockDirective };
