import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function TooltipController($element, $timeout, $window) {
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
     * The offset from the target.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _OFFSET = 8;

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
        const targetProps = {
            height: $element.outerHeight(),
            left: $element.offset().left,
            top: $element.offset().top - angular.element($window).scrollTop(),
            width: $element.outerWidth(),
        };
        const tooltipProps = {};

        _tooltip.css({ position: 'absolute' }).appendTo('body');

        /* eslint-disable no-magic-numbers */
        if (!lumx.position || lumx.position === 'top') {
            _tooltip.attr('x-placement', 'top');

            tooltipProps.x = targetProps.left - _tooltip.outerWidth() / 2 + targetProps.width / 2;
            tooltipProps.y = targetProps.top - _tooltip.outerHeight() - _OFFSET;
        } else if (lumx.position === 'bottom') {
            _tooltip.attr('x-placement', 'bottom');

            tooltipProps.x = targetProps.left - _tooltip.outerWidth() / 2 + targetProps.width / 2;
            tooltipProps.y = targetProps.top + targetProps.height + _OFFSET;
        } else if (lumx.position === 'left') {
            _tooltip.attr('x-placement', 'left');

            tooltipProps.x = targetProps.left - _tooltip.outerWidth() - _OFFSET;
            tooltipProps.y = targetProps.top + targetProps.height / 2 - _tooltip.outerHeight() / 2;
        } else if (lumx.position === 'right') {
            _tooltip.attr('x-placement', 'right');

            tooltipProps.x = targetProps.left + targetProps.width + _OFFSET;
            tooltipProps.y = targetProps.top + targetProps.height / 2 - _tooltip.outerHeight() / 2;
        }

        _tooltip.css({
            transform: `translate3d(${tooltipProps.x}px, ${tooltipProps.y}px, 0px)`,
        });
        /* eslint-enable no-magic-numbers */
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

        _tooltip.append(_tooltipArrow).append(_tooltipInner);

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
            ctrl.hideTooltip();
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
