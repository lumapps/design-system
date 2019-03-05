import { MODULE_NAME } from '@lumx/angularjs/lumx'

/////////////////////////////

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

angular.module(`${MODULE_NAME}.select`).directive('lxSelectFilter', lxSelectFilterDirective);

/////////////////////////////

export { lxSelectFilterDirective };
