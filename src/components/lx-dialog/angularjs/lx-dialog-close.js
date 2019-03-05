import { MODULE_NAME } from '@lumx/angularjs/lumx'

/////////////////////////////

function lxDialogCloseDirective(LxDialogService) {
    function link(scope, el) {
        el.on('click', function onClick() {
            LxDialogService.close(el.parents('.lx-dialog').attr('id'), true);
        });
    }

    return {
        link,
        restrict: 'A',
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dialog`).directive('lxDialogClose', lxDialogCloseDirective);

/////////////////////////////

export { lxDialogCloseDirective };
