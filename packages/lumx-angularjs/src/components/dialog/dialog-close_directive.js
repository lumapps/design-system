import { CSS_PREFIX } from '@lumx/core/constants';

/////////////////////////////

function DialogCloseDirective(LxDialogService) {
    'ngInject';

    function link(scope, el) {
        el.on('click', () => {
            LxDialogService.close(el.parents(`.${CSS_PREFIX}-dialog`).attr('id'));
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

angular.module('lumx.dialog').directive('lxDialogClose', DialogCloseDirective);

/////////////////////////////

export { DialogCloseDirective };
