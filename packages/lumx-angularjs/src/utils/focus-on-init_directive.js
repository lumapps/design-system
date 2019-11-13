import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

/////////////////////////////

function FocusOnInitDirective($timeout) {
    'ngInject';

    function link(scope, el, attrs) {
        if (angular.isDefined(attrs.lumxFocusOnInit) && attrs.lumxFocusOnInit && !scope.$eval(attrs.lumxFocusOnInit)) {
            return;
        }

        $timeout(() => {
            el.focus();
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.utils.focus-on-init`).directive(`${COMPONENT_PREFIX}FocusOnInit`, FocusOnInitDirective);

/////////////////////////////

export { FocusOnInitDirective };
