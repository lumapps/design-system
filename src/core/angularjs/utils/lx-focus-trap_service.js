import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function LxFocusTrapService() {
    const service = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The tab key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _TAB_KEY_CODE = 9;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Activate focus trap on given element.
     *
     * @param {element} el The element where to trap focus.
     */
    function activate(el) {
        el.on('keydown keypress', function onKeyPress(evt) {
            if (evt.keyCode !== _TAB_KEY_CODE) {
                return;
            }

            const focusableEls = el.find(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])',
            );

            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];

            if (evt.shiftKey) {
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    evt.preventDefault();
                }
            } else if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                evt.preventDefault();
            }
        });
    }

    /////////////////////////////

    service.activate = activate;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.utils.focus-trap`).service('LxFocusTrapService', LxFocusTrapService);

/////////////////////////////

export { LxFocusTrapService };
