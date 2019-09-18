import { COMPONENT_PREFIX, MODULE_NAME } from '../constants/common_constants';

/////////////////////////////

function StopPropagationDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        el.on(attrs.lumxStopPropagation, (evt) => {
            evt.stopPropagation();
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.utils.stop-propagation`)
    .directive(`${COMPONENT_PREFIX}StopPropagation`, StopPropagationDirective);

/////////////////////////////

export { StopPropagationDirective };
