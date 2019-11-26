import PopperJs from 'popper.js';

import { CSS_PREFIX } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './popover.html';

/////////////////////////////

function PopoverController(LumXDepthService, $element, $scope, $timeout) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The source element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _sourceEl;

    /**
     * The target element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _targetEl;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the popover is open or not.
     *
     * @type {boolean}
     */
    lumx.isOpen = false;

    /**
     * The popover uuid.
     *
     * @type {string}
     */
    lumx.uuid = undefined;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Close popover.
     */
    function _close() {
        lumx.isOpen = false;

        $timeout(() => {
            if (angular.isDefined(_sourceEl)) {
                _sourceEl.focus();
            }
        });
    }

    /**
     * Open popover.
     */
    function _open() {
        LumXDepthService.increase();

        $element.css('z-index', LumXDepthService.get());

        // eslint-disable-next-line no-new
        new PopperJs(_targetEl, $element, {
            modifiers: {
                offset: { enabled: true, offset: `0, ${lumx.offset}` },
            },
            placement: lumx.position || 'auto',
        });

        lumx.isOpen = true;
    }

    /**
     * Register the source element that triggered the popover.
     *
     * @param {element} sourceEl The source element that triggered the popover.
     */
    function _registerSource(sourceEl) {
        _sourceEl = sourceEl;
    }

    /**
     * Register the target element to position the popover.
     *
     * @param {element} targetEl The target element to position the popover.
     */
    function _registerTarget(targetEl) {
        _targetEl = targetEl;
    }

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Open a given popover.
     *
     * @param {Event}  evt       The popover open event.
     * @param {string} popoverId The popover identifier.
     * @param {Object} params    An optional object that holds extra parameters.
     */
    $scope.$on(`${COMPONENT_PREFIX}-popover__open`, (evt, popoverId, params) => {
        if (popoverId === lumx.uuid) {
            _registerTarget(angular.element(params.target));

            if (angular.isDefined(params.source)) {
                _registerSource(angular.element(params.source));
            }

            _open();
        }
    });

    /**
     * Close a given popover.
     *
     * @param {Event}  evt       The popover open event.
     * @param {Object} popoverId The popover identifier.
     */
    $scope.$on(`${COMPONENT_PREFIX}-popover__close`, (evt, popoverId) => {
        if (popoverId === lumx.uuid && lumx.isOpen) {
            _close();
        }
    });
}

/////////////////////////////

function PopoverDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('id', (id) => {
            ctrl.uuid = id;
        });

        const defaultProps = {
            elevation: '3',
        };

        if (!attrs.lumxElevation) {
            el.addClass(`${CSS_PREFIX}-popover--elevation-${defaultProps.elevation}`);
        }

        attrs.$observe('lumxElevation', (elevation) => {
            if (!elevation) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*popover--elevation-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-popover--elevation-${elevation}`);
        });
    }

    return {
        bindToController: true,
        controller: PopoverController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            offset: '@?lumxOffset',
            position: '@?lumxPosition',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.popover`).directive(`${COMPONENT_PREFIX}Popover`, PopoverDirective);

/////////////////////////////

export { PopoverDirective };
