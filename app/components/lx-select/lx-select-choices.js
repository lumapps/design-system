(function IIFE() {
    'use strict';

    /////////////////////////////

    lxSelectChoicesFilter.$inject = ['$filter'];

    function lxSelectChoicesFilter($filter) {
        return function(choices, externalFilter, textFilter) {
            if (externalFilter) {
                return choices;
            }

            var toFilter = [];

            if (!angular.isArray(choices)) {
                if (angular.isObject(choices)) {
                    for (var idx in choices) {
                        if (angular.isArray(choices[idx])) {
                            toFilter = toFilter.concat(choices[idx]);
                        }
                    }
                }
            } else {
                toFilter = choices;
            }

            return $filter('filter')(toFilter, textFilter);
        };
    }

    /////////////////////////////

    angular.module('lumx.select').filter('lxSelectChoices', lxSelectChoicesFilter);
})();
