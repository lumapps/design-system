import { CSS_PREFIX, DIALOG_TRANSITION_DURATION, ESCAPE_KEY_CODE } from '@lumx/core/js/constants';

import template from './dialog.html';

/////////////////////////////

function DialogController(
    $element,
    $rootScope,
    $scope,
    $timeout,
    LxDepthService,
    LxEventSchedulerService,
    LxFocusTrapService,
) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The default props.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _DEFAULT_PROPS = {
        size: 'big',
    };

    /**
     * The dialog.
     *
     * @type {Element}
     */
    const _dialog = $element;

    /**
     * The event scheduler id.
     *
     * @type {string}
     */
    let _idEventScheduler;

    /**
     * Whether the dialog is an alert dialog or not.
     *
     * @type {boolean}
     */
    let _isAlertDialog = false;

    /**
     * Whether the dialog is a confirm dialog or not.
     *
     * @type {boolean}
     */
    let _isConfirmDialog = false;

    /**
     * Whether the sentinels are intersecting with dialog content or not.
     *
     * @type {Object}
     */
    const _isIntersecting = { top: false, bottom: false };

    /**
     * The dialog parent element.
     *
     * @type {Element}
     */
    const _parentElement = _dialog.parent();

    /**
     * The source element.
     *
     * @type {element}
     */
    let _sourceEl;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The dialog identifier.
     *
     * @type {string}
     */
    lx.id = undefined;

    /**
     * Whether the dialog is open or not.
     *
     * @type {boolean}
     */
    lx.isOpen = false;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Close the current dialog.
     *
     * @param {boolean} canceled Indicates if the dialog was closed via a cancel or not.
     * @param {Object}  params   An optional object that holds extra parameters.
     */
    function _close(canceled, params) {
        if (!lx.isOpen) {
            return;
        }

        if (angular.isDefined(_idEventScheduler)) {
            LxEventSchedulerService.unregister(_idEventScheduler);
            _idEventScheduler = undefined;
        }

        $rootScope.$broadcast('lx-dialog__close-start', lx.id, canceled, params);

        _dialog.addClass(`${CSS_PREFIX}-dialog--is-hidden`);

        if (angular.isDefined(_sourceEl)) {
            _sourceEl.focus();
        }

        $timeout(() => {
            if (_isAlertDialog || _isConfirmDialog) {
                _dialog.remove();
            } else {
                _dialog
                    .removeClass(`${CSS_PREFIX}-dialog--is-shown`)
                    .removeClass(`${CSS_PREFIX}-dialog--is-hidden`)
                    .appendTo(_parentElement);
            }

            lx.isOpen = false;
            LxFocusTrapService.disable();

            $rootScope.$broadcast('lx-dialog__close-end', lx.id, canceled, params);
        }, DIALOG_TRANSITION_DURATION);
    }

    /**
     * Create dialog content observer.
     */
    function _createObserver() {
        const dialogHeader = _dialog.find(`.${CSS_PREFIX}-dialog__header`);
        const dialogFooter = _dialog.find(`.${CSS_PREFIX}-dialog__footer`);
        const sentinels = document.querySelectorAll(`.${CSS_PREFIX}-dialog__sentinel`);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.target.classList.contains(`${CSS_PREFIX}-dialog__sentinel--top`)) {
                    if (entry.isIntersecting) {
                        _isIntersecting.top = false;

                        if (!lx.forceHeaderDivider) {
                            dialogHeader.removeClass(`${CSS_PREFIX}-dialog__header--has-divider`);
                        }
                    } else {
                        _isIntersecting.top = true;

                        if (!lx.forceHeaderDivider) {
                            dialogHeader.addClass(`${CSS_PREFIX}-dialog__header--has-divider`);
                        }
                    }
                }

                if (entry.target.classList.contains(`${CSS_PREFIX}-dialog__sentinel--bottom`)) {
                    if (entry.isIntersecting) {
                        _isIntersecting.bottom = false;

                        if (!lx.forceFooterDivider) {
                            dialogFooter.removeClass(`${CSS_PREFIX}-dialog__footer--has-divider`);
                        }

                        $rootScope.$broadcast('lx-dialog__scroll-end', lx.id);
                    } else {
                        _isIntersecting.bottom = true;

                        if (!lx.forceFooterDivider) {
                            dialogFooter.addClass(`${CSS_PREFIX}-dialog__footer--has-divider`);
                        }
                    }
                }
            });
        });

        sentinels.forEach((sentinel) => {
            observer.observe(sentinel);
        });
    }

    /**
     * Close dialog on escape key down.
     *
     * @param {Event} evt The key down event.
     */
    function _onKeyDown(evt) {
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            _close();
        }

        evt.stopPropagation();
    }

    /**
     * Open the current dialog.
     *
     * @param {Object} params An optional object that holds extra parameters.
     */
    function _open(params) {
        if (lx.isOpen) {
            return;
        }

        if (angular.isUndefined(lx.escapeClose) || lx.escapeClose) {
            _idEventScheduler = LxEventSchedulerService.register('keydown', _onKeyDown);
        }

        LxDepthService.increase();

        _dialog
            .css('z-index', LxDepthService.get())
            .appendTo('body')
            .addClass(`${CSS_PREFIX}-dialog--is-shown`);

        $timeout(() => {
            $rootScope.$broadcast('lx-dialog__open-start', lx.id, params);

            lx.isOpen = true;
            LxFocusTrapService.activate(_dialog);

            $timeout(_createObserver);
        });

        $timeout(() => {
            $rootScope.$broadcast('lx-dialog__open-end', lx.id, params);
        }, DIALOG_TRANSITION_DURATION);
    }

    /**
     * Register the source element that triggered the dialog.
     *
     * @param {element} sourceEl The source element that triggered the dialog.
     */
    function _registerSource(sourceEl) {
        _sourceEl = sourceEl;
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get dialog classes.
     *
     * @return {Array} The list of dialog classes.
     */
    function getClasses() {
        const classes = [];

        const size = lx.size ? lx.size : _DEFAULT_PROPS.size;

        classes.push(`${CSS_PREFIX}-dialog--size-${size}`);

        if (lx.isLoading) {
            classes.push(`${CSS_PREFIX}-dialog--is-loading`);
        }

        return classes;
    }

    /**
     * Close dialog on overlay click.
     */
    function onOverlayClick() {
        if (angular.isUndefined(lx.autoClose) || lx.autoClose) {
            _close();
        }
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.onOverlayClick = onOverlayClick;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Open a given dialog.
     *
     * @param {Event}  evt      The dialog open event.
     * @param {string} dialogId The dialog identifier.
     * @param {Object} params   An optional object that holds extra parameters.
     */
    $scope.$on('lx-dialog__open', (evt, dialogId, params) => {
        if (dialogId === lx.id) {
            _open(params);

            if (angular.isDefined(params) && angular.isDefined(params.isAlertDialog) && params.isAlertDialog) {
                _isAlertDialog = true;
            }

            if (angular.isDefined(params) && angular.isDefined(params.isConfirmDialog) && params.isConfirmDialog) {
                _isConfirmDialog = true;
            }

            if (angular.isDefined(params) && angular.isDefined(params.source) && params.source) {
                _registerSource(angular.element(params.source));
            }
        }
    });

    /**
     * Close a given dialog.
     *
     * @param {Event}   evt      The dialog open event.
     * @param {string}  dialogId The dialog identifier.
     * @param {boolean} canceled Indicates if the dialog was closed via a cancel or not.
     * @param {Object}  params   An optional object that holds extra parameters.
     */
    $scope.$on('lx-dialog__close', (evt, dialogId, canceled, params) => {
        if (dialogId === lx.id || dialogId === undefined) {
            _close(canceled, params);
        }
    });

    /**
     * Close the current dialog on destroy.
     */
    $scope.$on('$destroy', _close);
}

/////////////////////////////

function DialogDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('id', (newId) => {
            ctrl.id = newId;
        });
    }

    return {
        bindToController: true,
        controller: DialogController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            autoClose: '=?lxAutoClose',
            escapeClose: '=?lxEscapeClose',
            forceFooterDivider: '=?lxForceFooterDivider',
            forceHeaderDivider: '=?lxForceHeaderDivider',
            isLoading: '=?lxIsLoading',
            size: '@?lxSize',
        },
        template,
        transclude: {
            content: 'lxDialogContent',
            footer: '?lxDialogFooter',
            header: '?lxDialogHeader',
        },
    };
}

/////////////////////////////

angular.module('lumx.dialog').directive('lxDialog', DialogDirective);

/////////////////////////////

export { DialogDirective };
