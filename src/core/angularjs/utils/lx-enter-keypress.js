import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxEnterKeypressDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        const _ENTER_KEY_CODE = 13;

        el.bind('keydown keypress', function onKeyPress(evt) {
            if (evt.which === _ENTER_KEY_CODE) {
                scope.$apply(function evalExpression() {
                    scope.$eval(attrs.lxEnterKeypress, { $event: evt });
                });

                evt.preventDefault();
            }
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.utils.enter-keypress`).directive('lxEnterKeypress', lxEnterKeypressDirective);

/////////////////////////////

export { lxEnterKeypressDirective };
