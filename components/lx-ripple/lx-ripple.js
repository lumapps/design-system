(function IIFE() {
    'use strict';

    /////////////////////////////

    LxRippleService.$inject = ['$timeout'];

    function LxRippleService($timeout) {
        var service = this;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Launch the ripple.
         *
         * @param {element} el   The element to prepend the ripple.
         * @param {string}  from Wether to start the animation from the center or the mouse position.
         * @param {event}   evt  The click event.
         */
        function launch(el, from, evt) {
            var ripple = angular.element('<span/>', {
                class: 'lx-ripple'
            });

            el.prepend(ripple);

            var diameter = Math.max(el.outerWidth(), el.outerHeight());

            ripple.css( {
                height: diameter,
                width: diameter
            });

            if (from === 'mouse') {
                var x = evt.pageX - el.offset().left - ripple.width() / 2;
                var y = evt.pageY - el.offset().top - ripple.height() / 2;

                ripple.css({
                    top: y + 'px',
                    left: x + 'px'
                });

                ripple.addClass('lx-ripple--from-mouse');
            } else {
                ripple.addClass('lx-ripple--from-center');
            }

            ripple.addClass('lx-ripple--is-animated');

            $timeout(function removeRipple() {
                ripple.remove();
            }, 500);
        }

        /////////////////////////////

        service.launch = launch;
    }

    /////////////////////////////

    angular.module('lumx.ripple').service('LxRipple', LxRippleService);
})();
