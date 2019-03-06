function lxFocusOnInitDirective($timeout) {
    function link(scope, el) {
        $timeout(() => {
            el.focus();
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular.module('lumx.utils.focus-on-init').directive('lxFocusOnInit', lxFocusOnInitDirective);

/////////////////////////////

export { lxFocusOnInitDirective };
