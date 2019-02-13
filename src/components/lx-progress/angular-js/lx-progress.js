import '../style/lx-progress.scss';

/////////////////////////////

function lxProgressController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lxProgress = this;
}

/////////////////////////////

function lxProgressDirective() {
    return {
        bindToController: true,
        controller: lxProgressController,
        controllerAs: 'lxProgress',
        replace: true,
        restrict: 'E',
        scope: {
            type: '@?lxType',
        },
        template: require('./lx-progress.html'),
        transclude: {
            help: '?lxCheckboxHelp',
            label: '?lxCheckboxLabel',
        },
    };
}

/////////////////////////////

angular.module('lumx.progress').directive('lxProgress', lxProgressDirective);

/////////////////////////////

export { lxProgressDirective };
