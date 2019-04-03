import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME, SERVICE_PREFIX } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function DialogService($compile, $rootScope, $timeout, LumXUtilsService) {
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
        const alertDialogId = LumXUtilsService.generateUUID();
        const alertDialogScope = $rootScope.$new(true);

        alertDialogScope.cb = params.cb;

        const compiledAlertDialog = $compile(
            `<${COMPONENT_PREFIX}-dialog id="${alertDialogId}" lumx-size="tiny" lumx-auto-close="false" lumx-escape-close="false">
                    <${COMPONENT_PREFIX}-dialog-header>
                        <${COMPONENT_PREFIX}-toolbar>
                            <${COMPONENT_PREFIX}-toolbar-label>
                                <span class="${CSS_PREFIX}-typography-title">${params.title}</span>
                            </${COMPONENT_PREFIX}-toolbar-label>
                        </${COMPONENT_PREFIX}-toolbar>
                    </${COMPONENT_PREFIX}-dialog-header>
                    <${COMPONENT_PREFIX}-dialog-content>
                        <div class="ph++ pb+">
                            <p>${params.text}</p>
                        </div>
                    </${COMPONENT_PREFIX}-dialog-content>
                    <${COMPONENT_PREFIX}-dialog-footer>
                        <${COMPONENT_PREFIX}-toolbar>
                            <${COMPONENT_PREFIX}-toolbar-after>
                                <${COMPONENT_PREFIX}-button ng-click="cb()" ${COMPONENT_PREFIX}-dialog-close ${COMPONENT_PREFIX}-focus-on-init>
                                    ${params.buttons.ok}
                                </${COMPONENT_PREFIX}-button>
                            </${COMPONENT_PREFIX}-toolbar-after>
                        </${COMPONENT_PREFIX}-toolbar>
                    </${COMPONENT_PREFIX}-dialog-footer>
                </${COMPONENT_PREFIX}-dialog>`,
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
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-dialog__close`, dialogId);
    }

    /**
     * Build a confirm dialog.
     *
     * @param {Object} params An object that holds title, text, button labels, callback and source parameters.
     */
    function confirmDialog(params) {
        const confirmDialogId = LumXUtilsService.generateUUID();
        const confirmDialogScope = $rootScope.$new(true);

        confirmDialogScope.cb = params.cb;

        const compiledConfirmDialog = $compile(
            `<${COMPONENT_PREFIX}-dialog id="${confirmDialogId}" lumx-size="tiny" lumx-auto-close="false" lumx-escape-close="false">
                    <${COMPONENT_PREFIX}-dialog-header>
                        <${COMPONENT_PREFIX}-toolbar>
                            <${COMPONENT_PREFIX}-toolbar-label>
                                <span class="${CSS_PREFIX}-typography-title">${params.title}</span>
                            </${COMPONENT_PREFIX}-toolbar-label>
                        </${COMPONENT_PREFIX}-toolbar>
                    </${COMPONENT_PREFIX}-dialog-header>
                    <${COMPONENT_PREFIX}-dialog-content>
                        <div class="ph++ pb+">
                            <p>${params.text}</p>
                        </div>
                    </${COMPONENT_PREFIX}-dialog-content>
                    <${COMPONENT_PREFIX}-dialog-footer>
                        <${COMPONENT_PREFIX}-toolbar>
                            <${COMPONENT_PREFIX}-toolbar-after>
                                <${COMPONENT_PREFIX}-button lumx-emphasis="medium" ng-click="cb(false)" ${COMPONENT_PREFIX}-dialog-close>
                                    ${params.buttons.cancel}
                                </${COMPONENT_PREFIX}-button>
                                <${COMPONENT_PREFIX}-button class="ml" ng-click="cb(true)" ${COMPONENT_PREFIX}-dialog-close ${COMPONENT_PREFIX}-focus-on-init>
                                    ${params.buttons.ok}
                                </${COMPONENT_PREFIX}-button>
                            </${COMPONENT_PREFIX}-toolbar-after>
                        </${COMPONENT_PREFIX}-toolbar>
                    </${COMPONENT_PREFIX}-dialog-footer>
                </${COMPONENT_PREFIX}-dialog>`,
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
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-dialog__open`, dialogId, params);
    }

    /////////////////////////////

    service.alert = alertDialog;
    service.close = closeDialog;
    service.confirm = confirmDialog;
    service.open = openDialog;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dialog`).service(`${SERVICE_PREFIX}DialogService`, DialogService);

/////////////////////////////

export { DialogService };
