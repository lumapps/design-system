import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function DialogCloseDirective(LumXDialogService) {
    'ngInject';

    function link(scope, el) {
        el.on('click', function onClick() {
            LumXDialogService.close(el.parents(`.${CSS_PREFIX}-dialog`).attr('id'), true);
        });
    }

    return {
        link,
        restrict: 'A',
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dialog`).directive(`${COMPONENT_PREFIX}DialogClose`, DialogCloseDirective);

/////////////////////////////

export { DialogCloseDirective };
