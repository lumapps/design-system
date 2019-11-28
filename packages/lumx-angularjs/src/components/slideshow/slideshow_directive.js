import { CSS_PREFIX, LEFT_KEY_CODE, RIGHT_KEY_CODE } from '@lumx/core/js/constants';

import { AUTOPLAY_DEFAULT_INTERVAL, FULL_WIDTH_PERCENT } from './constants';

import template from './slideshow.html';

/////////////////////////////

function SlideshowController($element, $interval, $scope) {
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
        groupBy: '1',
        theme: 'light',
    };

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
    lx.activeIndex = 0;

    /**
     * The number of slideshow items.
     *
     * @type {number}
     */
    lx.itemsCount = 0;

    /**
     * The number of slides.
     *
     * @type {number}
     */
    lx.slidesCount = 0;

    /**
     * The slideshow wrapper style.
     *
     * @type {Object}
     */
    lx.wrapperStyle = {
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
            _curentTransformOffset -= FULL_WIDTH_PERCENT * (newIndex - _curentIndex);
        } else {
            _curentTransformOffset += FULL_WIDTH_PERCENT * (_curentIndex - newIndex);
        }

        _curentIndex = newIndex;

        lx.wrapperStyle.transform = `translateX(${_curentTransformOffset}%)`;
    }

    /**
     * Go to next slide.
     */
    function _nextSlide() {
        if (lx.activeIndex + 1 === lx.slidesCount) {
            lx.activeIndex = 0;
        } else {
            lx.activeIndex++;
        }
    }

    /**
     * Go to previous slide.
     */
    function _previousSlide() {
        if (lx.activeIndex === 0) {
            lx.activeIndex = lx.slidesCount - 1;
        } else {
            lx.activeIndex--;
        }
    }

    /**
     * Handle key events on slideshow focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyPress(evt) {
        if (evt.keyCode === LEFT_KEY_CODE) {
            _previousSlide();

            lx.stopAutoPlay();

            $scope.$apply();

            evt.preventDefault();
            evt.stopPropagation();
        } else if (evt.keyCode === RIGHT_KEY_CODE) {
            _nextSlide();

            lx.stopAutoPlay();

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
     * Get slideshow classes.
     *
     * @return {Array} The list of slideshow classes.
     */
    function getClasses() {
        const classes = [];

        const groupBy = lx.groupBy ? lx.groupBy : _DEFAULT_PROPS.groupBy;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;

        classes.push(`${CSS_PREFIX}-slideshow--group-by-${groupBy}`);
        classes.push(`${CSS_PREFIX}-slideshow--theme-${theme}`);

        if (lx.fillHeight) {
            classes.push(`${CSS_PREFIX}-slideshow--fill-height`);
        }

        return classes;
    }

    /**
     * Start auto play.
     */
    function startAutoPlay() {
        if (angular.isUndefined(lx.autoPlayInterval)) {
            lx.autoPlayInterval = AUTOPLAY_DEFAULT_INTERVAL;
        }

        _autoPlayInterval = $interval(_nextSlide, lx.autoPlayInterval);
    }

    /**
     * Stop auto play.
     */
    function stopAutoPlay() {
        if (angular.isUndefined(_autoPlayInterval)) {
            return;
        }

        $interval.cancel(_autoPlayInterval);
        _autoPlayInterval = undefined;
    }

    /**
     * Update the number of slides according to the number of slideshow items and the group by parameter.
     */
    function updateSlidesCount() {
        if (angular.isUndefined(lx.groupBy)) {
            lx.groupBy = 1;
        }

        lx.slidesCount = Math.ceil(lx.itemsCount / lx.groupBy);
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.startAutoPlay = startAutoPlay;
    lx.stopAutoPlay = stopAutoPlay;
    lx.updateSlidesCount = updateSlidesCount;

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
    $scope.$watch('lx.activeIndex', (newIndex) => {
        if (angular.isDefined(newIndex)) {
            _goToSlide(newIndex);
        }
    });
}

/////////////////////////////

function SlideshowDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
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
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            activeIndex: '=?lxActiveIndex',
            autoPlay: '=?lxAutoPlay',
            autoPlayInterval: '@?lxAutoPlayInterval',
            customColors: '=?lxCustomColors',
            fillHeight: '=?lxFillHeight',
            groupBy: '=?lxGroupBy',
            hasControls: '=?lxHasControls',
            theme: '@?lxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.slideshow').directive('lxSlideshow', SlideshowDirective);

/////////////////////////////

export { SlideshowDirective };
