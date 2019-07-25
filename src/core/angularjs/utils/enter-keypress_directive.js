import { ENTER_KEY_CODE } from '../../constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '../constants/common_constants';

/////////////////////////////

function EnterKeypressDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        el.on('keydown keypress', (evt) => {
            if (evt.which === ENTER_KEY_CODE) {
                scope.$apply(function evalExpression() {
                    scope.$eval(attrs.lumxEnterKeypress, { $event: evt });
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

angular
    .module(`${MODULE_NAME}.utils.enter-keypress`)
    .directive(`${COMPONENT_PREFIX}EnterKeypress`, EnterKeypressDirective);

/////////////////////////////

export { EnterKeypressDirective };
