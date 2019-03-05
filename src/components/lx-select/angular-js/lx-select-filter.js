function lxSelectFilterDirective() {
    function link(scope, el) {
        el.on('click keydown keypress', function onFilterClick(evt) {
            evt.stopPropagation();
        });
    }

    return {
        link,
        restrict: 'A',
    };
}

/////////////////////////////

angular.module('lumx.select').directive('lxSelectFilter', lxSelectFilterDirective);

/////////////////////////////

export { lxSelectFilterDirective };
