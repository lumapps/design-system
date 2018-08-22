(function IIFE() {
    'use strict';

    /////////////////////////////

    lxRippleDirective.$inject = ['$timeout'];

    function lxRippleDirective($timeout) {
        function link(scope, el) {
            var timer;

            el.addClass('has-lx-ripple').on('mousedown', function(e) {
                var ripple = angular.element('<span/>', {
                    class: 'lx-ripple'
                });

                el.prepend(ripple);

                var diameter = Math.max(el.outerWidth(), el.outerHeight());

                ripple.css( {
                    height: diameter,
                    width: diameter
                });

                var x = e.pageX - el.offset().left - ripple.width() / 2;
                var y = e.pageY - el.offset().top - ripple.height() / 2;

                ripple.css({
                    top: y + 'px',
                    left: x + 'px'
                }).addClass('lx-ripple--is-animated');

                timer = $timeout(function() {
                    ripple.remove();
                }, 650);
            });

            scope.$on('$destroy', function() {
                $timeout.cancel(timer);
                el.off();
            });
        }

        return {
            link: link,
            restrict: 'A',
        };
    }

    /////////////////////////////

    angular.module('lumx.ripple').directive('lxRipple', lxRippleDirective);
})();
