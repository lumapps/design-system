import { CSS_PREFIX, DOWN_KEY_CODE } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function SelectFilterDirective() {
    'ngInject';

    function link(scope, el) {
        el.focus().on('click keydown keypress', (evt) => {
            evt.stopPropagation();

            if (evt.keyCode === DOWN_KEY_CODE) {
                el.parent()
                    .next()
                    .find(`.${CSS_PREFIX}-list-item:first-child`)
                    .focus();
            }
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
