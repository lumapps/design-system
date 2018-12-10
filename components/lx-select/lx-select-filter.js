(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxSelectFilterDirective() {
        function link(scope, el) {
            el.on('click', function onFilterClick(evt) {
                evt.stopPropagation();
            });
        }

        return {
            link: link,
            restrict: 'A',
        };
    }

    /////////////////////////////

    angular.module('lumx.select').directive('lxSelectFilter', lxSelectFilterDirective);
})();
