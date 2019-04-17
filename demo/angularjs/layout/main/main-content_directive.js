import template from './main-content.html';

/////////////////////////////

function mainContentController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const mainContent = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The documentation markdown file path.
     *
     * @type {boolean}
     */
    mainContent.src = '';
}

/////////////////////////////

function mainContentDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('component', (component) => {
            ctrl.src = `demo/angularjs/components/${component}/doc.md`;
        });
    }

    return {
        bindToController: true,
        controller: mainContentController,
        controllerAs: 'mainContent',
        link,
        replace: true,
        restrict: 'E',
        scope: true,
        template,
    };
}

/////////////////////////////

angular.module('design-system').directive('mainContent', mainContentDirective);

/////////////////////////////

export { mainContentDirective };
