import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function LxDialogService($compile, $rootScope, $timeout, LxUtilsService) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Build an alert dialog.
     *
     * @param {Object} params An object that holds title, text, button label, callback and source parameters.
     */
    function alertDialog(params) {
        const alertDialogId = LxUtilsService.generateUUID();
        const alertDialogScope = $rootScope.$new(true);

        alertDialogScope.cb = params.cb;

        const compiledAlertDialog = $compile(
            `<lx-dialog id="${alertDialogId}" lx-size="s" lx-auto-close="false" lx-escape-close="false">
                    <lx-dialog-header>
                        <lx-toolbar>
                            <lx-toolbar-label>
                                <span class="lx-typography-title">${params.title}</span>
                            </lx-toolbar-label>
                        </lx-toolbar>
                    </lx-dialog-header>
                    <lx-dialog-content>
                        <div class="ph++ pb+">
                            <p>${params.text}</p>
                        </div>
                    </lx-dialog-content>
                    <lx-dialog-footer>
                        <div class="p+" lx-grid-container="row" lx-grid-h-align="center" lx-grid-v-align="right">
                            <lx-button ng-click="cb()" lx-dialog-close lx-focus-on-init>${params.buttons.ok}</lx-button>
                        </div>
                    </lx-dialog-footer>
                </lx-dialog>`,
        )(alertDialogScope);

        angular.element('body').append(compiledAlertDialog);

        $timeout(function waitBeforeOpeningAlertDialog() {
            service.open(alertDialogId, { isAlertDialog: true, source: params.source });
        });
    }

    /**
     * Close a given dialog.
     *
     * @param {string} dialogId The dialog identifier.
     */
    function closeDialog(dialogId) {
        $rootScope.$broadcast('lx-dialog__close', dialogId);
    }

    /**
     * Build a confirm dialog.
     *
     * @param {Object} params An object that holds title, text, button labels, callback and source parameters.
     */
    function confirmDialog(params) {
        const confirmDialogId = LxUtilsService.generateUUID();
        const confirmDialogScope = $rootScope.$new(true);

        confirmDialogScope.cb = params.cb;

        const compiledConfirmDialog = $compile(
            `<lx-dialog id="${confirmDialogId}" lx-size="s" lx-auto-close="false" lx-escape-close="false">
                    <lx-dialog-header>
                        <lx-toolbar>
                            <lx-toolbar-label>
                                <span class="lx-typography-title">${params.title}</span>
                            </lx-toolbar-label>
                        </lx-toolbar>
                    </lx-dialog-header>
                    <lx-dialog-content>
                        <div class="ph++ pb+">
                            <p>${params.text}</p>
                        </div>
                    </lx-dialog-content>
                    <lx-dialog-footer>
                        <div class="p+" lx-grid-container="row" lx-grid-h-align="center" lx-grid-v-align="right">
                            <lx-button lx-emphasis="medium" ng-click="cb(false)" lx-dialog-close>
                                ${params.buttons.cancel}
                            </lx-button>
                            <lx-button class="ml" ng-click="cb(true)" lx-dialog-close lx-focus-on-init>
                                ${params.buttons.ok}
                            </lx-button>
                        </div>
                    </lx-dialog-footer>
                </lx-dialog>`,
        )(confirmDialogScope);

        angular.element('body').append(compiledConfirmDialog);

        $timeout(function waitBeforeOpeningAlertDialog() {
            service.open(confirmDialogId, { isConfirmDialog: true, source: params.source });
        });
    }

    /**
     * Open a given dialog.
     *
     * @param {string} dialogId The dialog identifier.
     * @param {Object} params   An optional object that holds extra parameters.
     */
    function openDialog(dialogId, params) {
        $rootScope.$broadcast('lx-dialog__open', dialogId, params);
    }

    /////////////////////////////

    service.alert = alertDialog;
    service.close = closeDialog;
    service.confirm = confirmDialog;
    service.open = openDialog;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dialog`).service('LxDialogService', LxDialogService);

/////////////////////////////

export { LxDialogService };
