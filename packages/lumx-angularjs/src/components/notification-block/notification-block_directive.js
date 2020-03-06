import template from './notification-block.html';

/////////////////////////////

function NotificationBlockController() {
    'ngInject';

    const lx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has after slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasBefore = false;
}

/////////////////////////////

function NotificationBlockDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('after')) {
            ctrl.hasAfter = true;
        }

        if (transclude.isSlotFilled('before')) {
            ctrl.hasBefore = true;
        }
    }

    return {
        bindToController: true,
        controller: NotificationBlockController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            date: '@?lxDate',
            description: '@?lxDescription',
            title: '@?lxTitle',
        },
        template,
        transclude: {
            after: '?lxNotificationBlockAfter',
            before: '?lxNotificationBlockBefore',
        },
    };
}

/////////////////////////////

angular.module('lumx.notification-block').directive('lxNotificationBlock', NotificationBlockDirective);

/////////////////////////////

export { NotificationBlockDirective };
