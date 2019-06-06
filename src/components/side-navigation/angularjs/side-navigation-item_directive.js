import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiChevronDown, mdiChevronUp } from 'LumX/icons';

import template from './side-navigation-item.html';

/////////////////////////////

function SideNavigationItemController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has children slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasChildren = false;

    /**
     * The side navigation item icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiChevronDown,
        mdiChevronUp,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Handle click event on side navigation item link.
     */
    function handleClick() {
        if (angular.isFunction(lumx.onClick)) {
            lumx.onClick();
        } else {
            lumx.isOpen = !lumx.isOpen;
        }
    }

    /////////////////////////////

    lumx.handleClick = handleClick;
}

/////////////////////////////

function SideNavigationItemDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        transclude((clone) => {
            if (clone.length > 0) {
                ctrl.hasChildren = true;
            }
        });
    }

    return {
        bindToController: true,
        controller: SideNavigationItemController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            icon: '@?lumxIcon',
            isOpen: '=?lumxIsOpen',
            isSelected: '=?lumxIsSelected',
            label: '@lumxLabel',
            onClick: '&?lumxOnClick',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.side-navigation`)
    .directive(`${COMPONENT_PREFIX}SideNavigationItem`, SideNavigationItemDirective);

/////////////////////////////

export { SideNavigationItemDirective };
