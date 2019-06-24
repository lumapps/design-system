import PopperJs from 'popper.js';

import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function TooltipController($element, $timeout, LumXDepthService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * Delay before showing the tooltip on source element mouse enter.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _HOVER_DELAY = 500;

    /**
     * The tooltip element.
     *
     * @type {element}
     */
    let _hoverTimeout;

    /**
     * The tooltip label element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _tooltip;

    /**
     * The source element mouse enter timeout.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _tooltipArrow;

    /**
     * The source element mouse enter timeout.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _tooltipInner;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the tooltip position according to the position parameter.
     */
    function _setTooltipPosition() {
        _tooltip.appendTo('body');

        // eslint-disable-next-line no-new
        new PopperJs($element, _tooltip, {
            placement: lumx.position || 'top',
            modifiers: {
                arrow: {
                    // eslint-disable-next-line id-blacklist
                    element: `.${CSS_PREFIX}-tooltip__arrow`,
                    enabled: true,
                },
            },
        });
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Hide the tooltip on source element mouse leave.
     */
    function hideTooltip() {
        if (angular.isUndefined(_tooltip)) {
            return;
        }

        $timeout.cancel(_hoverTimeout);

        _tooltip.remove();
        _tooltip = undefined;
    }

    /**
     * Show the tooltip on source element mouse enter.
     */
    function showTooltip() {
        if (angular.isDefined(_tooltip)) {
            return;
        }

        _tooltip = angular.element('<div/>', {
            class: `${CSS_PREFIX}-tooltip`,
        });

        _tooltipArrow = angular.element('<div/>', {
            class: `${CSS_PREFIX}-tooltip__arrow`,
        });

        _tooltipInner = angular.element('<span/>', {
            class: `${CSS_PREFIX}-tooltip__inner`,
            text: lumx.text,
        });

        LumXDepthService.increase();

        _tooltip
            .append(_tooltipArrow)
            .append(_tooltipInner)
            .css('z-index', LumXDepthService.get());

        _hoverTimeout = $timeout(_setTooltipPosition, _HOVER_DELAY);
    }

    /////////////////////////////

    lumx.hideTooltip = hideTooltip;
    lumx.showTooltip = showTooltip;
}

/////////////////////////////

function TooltipDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        el.on('mouseenter', ctrl.showTooltip);
        el.on('mouseleave', ctrl.hideTooltip);

        scope.$on('$destroy', () => {
            el.off();
        });
    }

    return {
        bindToController: true,
        controller: TooltipController,
        controllerAs: 'lumx',
        link,
        restrict: 'A',
        scope: {
            position: '@?lumxTooltipPosition',
            text: '@lumxTooltip',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.tooltip`).directive(`${COMPONENT_PREFIX}Tooltip`, TooltipDirective);

/////////////////////////////

export { TooltipDirective };
