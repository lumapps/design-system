import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function SelectFilterDirective() {
    'ngInject';

    function link(scope, el) {
        el.on('click keydown keypress', (evt) => {
            evt.stopPropagation();
        });

        scope.$on('$destroy', () => {
            el.off();
        });
    }

    return {
        link,
        restrict: 'A',
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.select`).directive(`${COMPONENT_PREFIX}SelectFilter`, SelectFilterDirective);

/////////////////////////////

export { SelectFilterDirective };
