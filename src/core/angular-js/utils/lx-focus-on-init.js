function lxFocusOnInitDirective() {
    function link(scope, el) {
        el.focus();
    }

    return {
        link,
    };
}

/////////////////////////////

angular.module('lumx.utils.focus-on-init').directive('lxFocusOnInit', lxFocusOnInitDirective);

/////////////////////////////

export { lxFocusOnInitDirective };
