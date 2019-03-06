import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

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
