import { mdiClose } from '@lumx/icons';

import { CSS_PREFIX, ESCAPE_KEY_CODE } from '@lumx/core/constants';

import template from './lightbox.html';

/////////////////////////////

function LightboxController($element, $scope, LxDepthService, LxFocusTrapService, LxEventSchedulerService, $timeout) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The lightbox open/close transition duration.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _TRANSITION_DURATION = 400;

    /**
     * The event scheduler id.
     *
     * @type {string}
     */
    let _idEventScheduler;

    /**
     * The lightbox.
     *
     * @type {Element}
     */
    const _lightbox = $element;

    /**
     * The lightbox parent element.
     *
     * @type {Element}
     */
    const _parentElement = _lightbox.parent();

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
     * The lightbox icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiClose,
    };

    /**
     * The lightbox identifier.
     *
     * @type {string}
     */
    lx.id = undefined;

    /**
     * Whether the lightbox is open or not.
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
     * Close lightbox on escape key up.
     *
     * @param {Event} evt The key up event.
     */
    function _onKeyUp(evt) {
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            lx.closeLightbox();
        }

        evt.stopPropagation();
    }

    /**
     * Open the current lightbox.
     */
    function _open() {
        if (lx.isOpen) {
            return;
        }

        LxDepthService.increase();

        _lightbox
            .css('z-index', LxDepthService.get())
            .appendTo('body')
            .show();

        _idEventScheduler = LxEventSchedulerService.register('keyup', _onKeyUp);

        $timeout(() => {
            lx.isOpen = true;

            LxFocusTrapService.activate(_lightbox);
        });
    }

    /**
     * Register the source element that triggered the lightbox.
     *
     * @param {element} sourceEl The source element that triggered the lightbox.
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
     * Close the current lightbox.
     */
    function closeLightbox() {
        if (!lx.isOpen) {
            return;
        }

        if (angular.isDefined(_idEventScheduler)) {
            LxEventSchedulerService.unregister(_idEventScheduler);
            _idEventScheduler = undefined;
        }

        _lightbox.addClass(`${CSS_PREFIX}-lightbox--is-hidden`);

        if (angular.isDefined(_sourceEl)) {
            _sourceEl.focus();
        }

        $timeout(() => {
            _lightbox
                .hide()
                .removeClass(`${CSS_PREFIX}-lightbox--is-hidden`)
                .appendTo(_parentElement);

            lx.isOpen = false;

            LxFocusTrapService.disable();
        }, _TRANSITION_DURATION);
    }

    /////////////////////////////

    lx.closeLightbox = closeLightbox;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Open a given lightbox.
     *
     * @param {Event}  evt        The lightbox open event.
     * @param {string} lightboxId The lightbox identifier.
     * @param {Object} params     An optional object that holds extra parameters.
     */
    $scope.$on('lx-lightbox__open', (evt, lightboxId, params) => {
        if (lightboxId === lx.id) {
            _open(params);

            if (angular.isDefined(params) && angular.isDefined(params.source) && params.source) {
                _registerSource(angular.element(params.source));
            }
        }
    });

    /**
     * Close a given lightbox.
     *
     * @param {Event}  evt        The lightbox open event.
     * @param {string} lightboxId The lightbox identifier.
     */
    $scope.$on('lx-lightbox__close', (evt, lightboxId) => {
        if (lightboxId === lx.id || lightboxId === undefined) {
            lx.closeLightbox();
        }
    });

    /**
     * Close the current lightbox on destroy.
     */
    $scope.$on('$destroy', () => {
        lx.closeLightbox();
    });
}

/////////////////////////////

function LightboxDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('id', (newId) => {
            ctrl.id = newId;
        });
    }

    return {
        bindToController: true,
        controller: LightboxController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {},
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.lightbox').directive('lxLightbox', LightboxDirective);

/////////////////////////////

export { LightboxDirective };
