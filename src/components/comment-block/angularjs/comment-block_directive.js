import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './comment-block.html';

/////////////////////////////

function CommentBlockController() {
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
     * Whether the directive has children slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasChildren = false;
}

/////////////////////////////

function CommentBlockDirective() {
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
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            avatar: '@lumxAvatar',
            date: '@?lumxDate',
            isOpen: '=?lumxIsOpen',
            name: '@lumxName',
            text: '@lumxText',
            theme: '@?lumxTheme',
        },
        template,
        transclude: {
            actions: `?${COMPONENT_PREFIX}CommentBlockActions`,
            children: `?${COMPONENT_PREFIX}CommentBlockChildren`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.comment-block`).directive(`${COMPONENT_PREFIX}CommentBlock`, CommentBlockDirective);

/////////////////////////////

export { CommentBlockDirective };
