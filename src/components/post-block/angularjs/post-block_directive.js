import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

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
            theme: 'light',
            variant: 'list',
        };

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

        if (!attrs.lumxVariant) {
            el.addClass(`${CSS_PREFIX}-post-block--variant-${defaultProps.variant}`);
        }

        attrs.$observe('lumxVariant', (variant) => {
            if (!variant) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*post-block--variant-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-post-block--variant-${variant}`);
        });

        if (transclude.isSlotFilled('actions')) {
            ctrl.hasActions = true;
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
            text: '@?lumxText',
            thumbnail: '=?lumxThumbnail',
            title: '@?lumxTitle',
            theme: '@?lumxTheme',
            variant: '@?lumxVariant',
        },
        template,
        transclude: {
            actions: `?${COMPONENT_PREFIX}PostBlockActions`,
            author: `?${COMPONENT_PREFIX}PostBlockAuthor`,
            tags: `?${COMPONENT_PREFIX}PostBlockTags`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.post-block`).directive(`${COMPONENT_PREFIX}PostBlock`, PostBlockDirective);

/////////////////////////////

export { PostBlockDirective };
