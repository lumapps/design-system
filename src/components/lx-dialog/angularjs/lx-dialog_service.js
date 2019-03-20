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
            `<nglx-dialog id="${alertDialogId}" lx-size="s" lx-auto-close="false" lx-escape-close="false">
                    <nglx-dialog-header>
                        <nglx-toolbar>
                            <nglx-toolbar-label>
                                <span class="lx-typography-title">${params.title}</span>
                            </nglx-toolbar-label>
                        </nglx-toolbar>
                    </nglx-dialog-header>
                    <nglx-dialog-content>
                        <div class="ph++ pb+">
                            <p>${params.text}</p>
                        </div>
                    </nglx-dialog-content>
                    <nglx-dialog-footer>
                        <div class="p+" lx-grid-container="row" lx-grid-h-align="center" lx-grid-v-align="right">
                            <nglx-button ng-click="cb()" nglx-dialog-close lx-focus-on-init>${
                                params.buttons.ok
                            }</nglx-button>
                        </div>
                    </nglx-dialog-footer>
                </nglx-dialog>`,
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
            `<nglx-dialog id="${confirmDialogId}" lx-size="s" lx-auto-close="false" lx-escape-close="false">
                    <nglx-dialog-header>
                        <nglx-toolbar>
                            <nglx-toolbar-label>
                                <span class="lx-typography-title">${params.title}</span>
                            </nglx-toolbar-label>
                        </nglx-toolbar>
                    </nglx-dialog-header>
                    <nglx-dialog-content>
                        <div class="ph++ pb+">
                            <p>${params.text}</p>
                        </div>
                    </nglx-dialog-content>
                    <nglx-dialog-footer>
                        <div class="p+" lx-grid-container="row" lx-grid-h-align="center" lx-grid-v-align="right">
                            <nglx-button lx-emphasis="medium" ng-click="cb(false)" nglx-dialog-close>
                                ${params.buttons.cancel}
                            </nglx-button>
                            <nglx-button class="ml" ng-click="cb(true)" nglx-dialog-close lx-focus-on-init>
                                ${params.buttons.ok}
                            </nglx-button>
                        </div>
                    </nglx-dialog-footer>
                </nglx-dialog>`,
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
