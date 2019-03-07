import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxDialogCloseDirective(LxDialogService) {
    'ngInject';

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
