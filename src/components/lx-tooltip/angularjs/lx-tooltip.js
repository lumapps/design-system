import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxTooltipController($element, $timeout, LxDepthService) {
    // eslint-disable-next-line consistent-this
    const lxTooltip = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * Offset from the source element.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _OFFSET_FROM_SOURCE = 8;

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
     * @type {Object}
     */
    // eslint-disable-next-line one-var
    let _tooltipLabel;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the tooltip position according to the position parameter.
     */
    function _setTooltipPosition() {
        const sourceProps = {
            height: $element.outerHeight(),
            left: $element.offset().left,
            top: $element.offset().top,
            width: $element.outerWidth(),
        };
        const tooltipProps = {
            height: _tooltip.outerHeight(),
            width: _tooltip.outerWidth(),
        };

        if (angular.isUndefined(lxTooltip.position) || lxTooltip.position === 'top') {
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.left = sourceProps.left - tooltipProps.width / 2 + sourceProps.width / 2;
            tooltipProps.top = sourceProps.top - tooltipProps.height - _OFFSET_FROM_SOURCE;
        } else if (lxTooltip.position === 'bottom') {
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.left = sourceProps.left - tooltipProps.width / 2 + sourceProps.width / 2;
            tooltipProps.top = sourceProps.top + sourceProps.height + _OFFSET_FROM_SOURCE;
        } else if (lxTooltip.position === 'left') {
            tooltipProps.left = sourceProps.left - tooltipProps.width - _OFFSET_FROM_SOURCE;
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.top = sourceProps.top + sourceProps.height / 2 - tooltipProps.height / 2;
        } else if (lxTooltip.position === 'right') {
            tooltipProps.left = sourceProps.left + sourceProps.width + _OFFSET_FROM_SOURCE;
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.top = sourceProps.top + sourceProps.height / 2 - tooltipProps.height / 2;
        }

        _tooltip
            .css({
                left: tooltipProps.left,
                top: tooltipProps.top,
            })
            .addClass('lx-tooltip--is-shown');
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
            class: 'lx-tooltip',
        });

        _tooltipLabel = angular.element('<span/>', {
            class: 'lx-tooltip__text',
            text: lxTooltip.text,
        });

        LxDepthService.increase();

        _tooltip
            .append(_tooltipLabel)
            .css('z-index', LxDepthService.get())
            .appendTo('body');

        _hoverTimeout = $timeout(_setTooltipPosition, _HOVER_DELAY);
    }

    /////////////////////////////

    lxTooltip.hideTooltip = hideTooltip;
    lxTooltip.showTooltip = showTooltip;
}

/////////////////////////////

function lxTooltipDirective() {
    function link(scope, el, attrs, ctrl) {
        el.on('mouseenter', ctrl.showTooltip);
        el.on('mouseleave', ctrl.hideTooltip);

        scope.$on('$destroy', () => {
            el.off();
        });
    }

    return {
        bindToController: true,
        controller: lxTooltipController,
        controllerAs: 'lxTooltip',
        link,
        restrict: 'A',
        scope: {
            position: '@?lxTooltipPosition',
            text: '@lxTooltip',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.tooltip`).directive('lxTooltip', lxTooltipDirective);

/////////////////////////////

export { lxTooltipDirective };
