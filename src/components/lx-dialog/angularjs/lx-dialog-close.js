import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxDialogCloseDirective(NglxDialogService) {
    'ngInject';

    function link(scope, el) {
        el.on('click', function onClick() {
            NglxDialogService.close(el.parents('.lx-dialog').attr('id'), true);
        });
    }

    return {
        link,
        restrict: 'A',
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dialog`).directive(`${COMPONENT_PREFIX}DialogClose`, lxDialogCloseDirective);

/////////////////////////////

export { lxDialogCloseDirective };
