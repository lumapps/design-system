import { CSS_PREFIX } from '@lumx/core/constants';

import template from './comment-block.html';

/////////////////////////////

function CommentBlockController() {
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
     * Whether the directive has children slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasChildren = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get comment block classes.
     *
     * @return {Array} The list of comment block classes.
     */
    function getClasses() {
        const classes = [];

        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;
        classes.push(`${CSS_PREFIX}-comment-block--theme-${theme}`);

        if (lx.hasChildren && lx.isOpen) {
            classes.push(`${CSS_PREFIX}-comment-block--has-children`);
        }

        if (lx.isRelevant) {
            classes.push(`${CSS_PREFIX}-comment-block--is-relevant`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function CommentBlockDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('actions')) {
            ctrl.hasActions = true;
        }

        if (transclude.isSlotFilled('children')) {
            ctrl.hasChildren = true;
        }
    }

    return {
        bindToController: true,
        controller: CommentBlockController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            avatar: '@lxAvatar',
            date: '@?lxDate',
            isOpen: '=?lxIsOpen',
            isRelevant: '=?lxIsRelevant',
            name: '@lxName',
            onClick: '&?lxOnClick',
            onMouseEnter: '&?lxOnMouseEnter',
            onMouseLeave: '&?lxOnMouseLeave',
            text: '@lxText',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            actions: '?lxCommentBlockActions',
            children: '?lxCommentBlockChildren',
        },
    };
}

/////////////////////////////

angular.module('lumx.comment-block').directive('lxCommentBlock', CommentBlockDirective);

/////////////////////////////

export { CommentBlockDirective };
