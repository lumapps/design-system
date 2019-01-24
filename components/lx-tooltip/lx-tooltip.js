(function IIFE() {
    'use strict';

    /////////////////////////////

    lxTooltipController.$inject = ['$element', '$timeout', 'LxDepthService'];

    function lxTooltipController($element, $timeout, LxDepthService) {
        var lxTooltip = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * Offset from the source element.
         *
         * @type {integer}
         */
        var _OFFSET_FROM_SOURCE = 8;

        /**
         * Delay before showing the tooltip on source element mouse enter.
         *
         * @type {integer}
         */
        var _HOVER_DELAY = 500;

        /**
         * The tooltip element.
         *
         * @type {element}
         */
        var _tooltip;

        /**
         * The tooltip label element.
         *
         * @type {element}
         */
        var _tooltipLabel;

        /**
         * The source element mouse enter timeout.
         *
         * @type {Object}
         */
        var _hoverTimeout;

        /////////////////////////////
        //                         //
        //    Private functions    //
        //                         //
        /////////////////////////////

        /**
         * Set the tooltip position according to the position parameter.
         */
        function _setTooltipPosition() {
            var sourceProps = {
                height: $element.outerHeight(),
                left: $element.offset().left,
                top: $element.offset().top,
                width: $element.outerWidth(),
            };
            var tooltipProps = {
                height: _tooltip.outerHeight(),
                width: _tooltip.outerWidth(),
            };

            if (angular.isUndefined(lxTooltip.position) || lxTooltip.position === 'top') {
                tooltipProps.left = sourceProps.left - (tooltipProps.width / 2) + (sourceProps.width / 2);
                tooltipProps.top = (sourceProps.top - tooltipProps.height) - _OFFSET_FROM_SOURCE;
            } else if (lxTooltip.position === 'bottom') {
                tooltipProps.left = sourceProps.left - (tooltipProps.width / 2) + (sourceProps.width / 2);
                tooltipProps.top = (sourceProps.top + sourceProps.height) + _OFFSET_FROM_SOURCE;
            } else if (lxTooltip.position === 'left') {
                tooltipProps.left = (sourceProps.left - tooltipProps.width) - _OFFSET_FROM_SOURCE;
                tooltipProps.top = sourceProps.top + (sourceProps.height / 2) - (tooltipProps.height / 2);
            } else if (lxTooltip.position === 'right') {
                tooltipProps.left = (sourceProps.left + sourceProps.width) + _OFFSET_FROM_SOURCE;
                tooltipProps.top = sourceProps.top + (sourceProps.height / 2) - (tooltipProps.height  / 2);
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

            scope.$on('$destroy', function() {
                el.off();
            });
        }

        return {
            bindToController: true,
            controller: lxTooltipController,
            controllerAs: 'lxTooltip',
            link: link,
            restrict: 'A',
            scope: {
                position: '@?lxTooltipPosition',
                text: '@lxTooltip',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.tooltip').directive('lxTooltip', lxTooltipDirective);
})();
