function lxEnterKeypressDirective() {
    function link(scope, el, attrs) {
        const _ENTER_KEY_CODE = 13;

        el.bind('keydown keypress', function onKeyPress(evt) {
            if (evt.which === _ENTER_KEY_CODE) {
                scope.$apply(function evalExpression() {
                    scope.$eval(attrs.lxEnterKeypress);
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

angular.module('lumx.utils.enter-keypress').directive('lxEnterKeypress', lxEnterKeypressDirective);

/////////////////////////////

export { lxEnterKeypressDirective };
