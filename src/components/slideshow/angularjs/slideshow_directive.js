import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './slideshow.html';

/////////////////////////////

function SlideshowController($element, $interval, $scope) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The autoplay default interval in ms.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _AUTOPLAY_DEFAULT_INTERVAL = 5000;

    /**
     * The full width size in percent.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _FULL_WIDTH_PERCENT = 100;

    /**
     * The left key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _LEFT_KEY_CODE = 37;

    /**
     * The right key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _RIGHT_KEY_CODE = 39;

    /**
     * The current slide index.
     *
     * @type {number}
     */
    let _curentIndex = 0;

    /**
     * The current transform offset.
     *
     * @type {number}
     */
    let _curentTransformOffset = 0;

    /**
     * The autoplay interval.
     *
     * @type {number}
     */
    let _autoPlayInterval;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The slide default active index.
     *
     * @type {number}
     */
    lumx.activeIndex = 0;

    /**
     * The number of slideshow items.
     *
     * @type {number}
     */
    lumx.itemsCount = 0;

    /**
     * The number of slides.
     *
     * @type {number}
     */
    lumx.slidesCount = 0;

    /**
     * The slideshow wrapper style.
     *
     * @type {Object}
     */
    lumx.wrapperStyle = {
        transform: 'translate3d(0%, 0, 0)',
    };

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Go to the given slide index.
     *
     * @param {number} newIndex The new slide index.
     */
    function _goToSlide(newIndex) {
        if (newIndex > _curentIndex) {
            _curentTransformOffset -= _FULL_WIDTH_PERCENT * (newIndex - _curentIndex);
        } else {
            _curentTransformOffset += _FULL_WIDTH_PERCENT * (_curentIndex - newIndex);
        }

        _curentIndex = newIndex;

        lumx.wrapperStyle.transform = `translateX(${_curentTransformOffset}%)`;
    }

    /**
     * Handle key events on slideshow focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyPress(evt) {
        if (evt.keyCode === _LEFT_KEY_CODE) {
            if (lumx.activeIndex === 0) {
                return;
            }

            lumx.activeIndex--;

            $scope.$apply();

            evt.preventDefault();
            evt.stopPropagation();
        } else if (evt.keyCode === _RIGHT_KEY_CODE) {
            if (lumx.activeIndex + 1 === lumx.slidesCount) {
                return;
            }

            lumx.activeIndex++;

            $scope.$apply();

            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Start auto play.
     */
    function startAutoPlay() {
        if (angular.isUndefined(lumx.autoPlayInterval)) {
            lumx.autoPlayInterval = _AUTOPLAY_DEFAULT_INTERVAL;
        }

        _autoPlayInterval = $interval(() => {
            if (lumx.activeIndex + 1 === lumx.slidesCount) {
                return;
            }

            lumx.activeIndex++;
        }, lumx.autoPlayInterval);
    }

    /**
     * Stop auto play.
     */
    function stopAutoPlay() {
        $interval.cancel(_autoPlayInterval);
        _autoPlayInterval = undefined;
    }

    /**
     * Update the number of slides according to the number of slideshow items and the group by parameter.
     */
    function updateSlidesCount() {
        if (angular.isUndefined(lumx.groupBy)) {
            lumx.groupBy = 1;
        }

        lumx.slidesCount = Math.ceil(lumx.itemsCount / lumx.groupBy);
    }

    /////////////////////////////

    lumx.startAutoPlay = startAutoPlay;
    lumx.stopAutoPlay = stopAutoPlay;
    lumx.updateSlidesCount = updateSlidesCount;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Navigate through slides on left and right arrow key press.
     */
    $element.on('keydown keypress', _onKeyPress);

    /**
     * Unbind event listener on destroy.
     */
    $scope.$on('$destroy', () => {
        $element.off('keydown keypress', _onKeyPress);
    });

    /////////////////////////////
    //                         //
    //        Watchers         //
    //                         //
    /////////////////////////////

    /**
     * Watch for any changes of the active index to go to corresping slide.
     *
     * @param {number} newIndex The new slide index.
     */
    $scope.$watch('lumx.activeIndex', (newIndex) => {
        if (angular.isDefined(newIndex)) {
            _goToSlide(newIndex);
        }
    });
}

/////////////////////////////

function SlideshowDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        const defaultProps = {
            groupBy: 1,
            theme: 'light',
        };

        if (!attrs.lumxGroupBy) {
            el.addClass(`${CSS_PREFIX}-slideshow--group-by-${defaultProps.groupBy}`);
        }

        attrs.$observe('lumxGroupBy', (groupBy) => {
            if (!groupBy) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*slideshow--group-by-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-slideshow--group-by-${groupBy}`);
        });

        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-slideshow--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*slideshow--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-slideshow--theme-${theme}`);
        });

        attrs.$observe('lumxAutoPlay', (autoPlay) => {
            if (scope.$eval(autoPlay)) {
                ctrl.startAutoPlay();
            } else {
                ctrl.stopAutoPlay();
            }
        });
    }

    return {
        bindToController: true,
        controller: SlideshowController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            activeIndex: '=?lumxActiveIndex',
            autoPlay: '=?lumxAutoPlay',
            autoPlayInterval: '@?lumxAutoPlayInterval',
            groupBy: '=?lumxGroupBy',
            hasControls: '=?lumxHasControls',
            theme: '@?lumxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.slideshow`).directive(`${COMPONENT_PREFIX}Slideshow`, SlideshowDirective);

/////////////////////////////

export { SlideshowDirective };
