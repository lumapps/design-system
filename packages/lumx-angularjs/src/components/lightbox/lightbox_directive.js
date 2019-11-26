import { mdiClose } from '@lumx/icons';

import { CSS_PREFIX, ESCAPE_KEY_CODE } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './lightbox.html';

/////////////////////////////

function LightboxController(
    $element,
    $scope,
    LumXDepthService,
    LumXFocusTrapService,
    LumXEventSchedulerService,
    $timeout,
) {
    // eslint-disable-next-line consistent-this
    const lumx = this;

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
    lumx.icons = {
        mdiClose,
    };

    /**
     * The lightbox identifier.
     *
     * @type {string}
     */
    lumx.id = undefined;

    /**
     * Whether the lightbox is open or not.
     *
     * @type {boolean}
     */
    lumx.isOpen = false;

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
            lumx.closeLightbox();
        }

        evt.stopPropagation();
    }

    /**
     * Open the current lightbox.
     */
    function _open() {
        if (lumx.isOpen) {
            return;
        }

        LumXDepthService.increase();

        _lightbox
            .css('z-index', LumXDepthService.get())
            .appendTo('body')
            .show();

        _idEventScheduler = LumXEventSchedulerService.register('keyup', _onKeyUp);

        $timeout(() => {
            lumx.isOpen = true;

            LumXFocusTrapService.activate(_lightbox);
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
        if (!lumx.isOpen) {
            return;
        }

        if (angular.isDefined(_idEventScheduler)) {
            LumXEventSchedulerService.unregister(_idEventScheduler);
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

            lumx.isOpen = false;

            LumXFocusTrapService.disable();
        }, _TRANSITION_DURATION);
    }

    /////////////////////////////

    lumx.closeLightbox = closeLightbox;

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
    $scope.$on(`${COMPONENT_PREFIX}-lightbox__open`, (evt, lightboxId, params) => {
        if (lightboxId === lumx.id) {
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
    $scope.$on(`${COMPONENT_PREFIX}-lightbox__close`, (evt, lightboxId) => {
        if (lightboxId === lumx.id || lightboxId === undefined) {
            lumx.closeLightbox();
        }
    });

    /**
     * Close the current lightbox on destroy.
     */
    $scope.$on('$destroy', () => {
        lumx.closeLightbox();
    });
}

/////////////////////////////

function LightboxDirective() {
    function link(scope, el, attrs, ctrl) {
        attrs.$observe('id', (newId) => {
            ctrl.id = newId;
        });
    }

    return {
        bindToController: true,
        controller: LightboxController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {},
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.lightbox`).directive(`${COMPONENT_PREFIX}Lightbox`, LightboxDirective);

/////////////////////////////

export { LightboxDirective };
