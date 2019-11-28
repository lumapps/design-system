import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

import { CSS_PREFIX } from '@lumx/core/js/constants';

import { EDGE_FROM_ACTIVE_INDEX, PAGINATION_ITEMS_MAX, PAGINATION_ITEM_SIZE } from './constants';

import template from './slideshow-controls.html';

/////////////////////////////

function SlideshowControlsController($element, $scope) {
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
        theme: 'light',
    };

    /**
     * The current slide index.
     *
     * @type {number}
     */
    let _currentIndex = 0;

    /**
     * The current transform offset.
     *
     * @type {number}
     */
    let _curentTransformOffset = 0;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The slideshow controls icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiChevronLeft,
        mdiChevronRight,
    };

    /**
     * The max number of pagination items.
     *
     * @type {number}
     */
    lx.paginationItemsMax = PAGINATION_ITEMS_MAX;

    /**
     * The pagination items range.
     *
     * @type {Array}
     */
    lx.paginationItemsRange = [];

    /**
     * The pagination items visible range.
     *
     * @type {Array}
     */
    lx.paginationItemsVisibleRange = [];

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Move pagination wrapper according to current transform offset.
     */
    function _movePaginationWrapper() {
        const paginationItemsWrapper = $element.find(`.${CSS_PREFIX}-slideshow-controls__pagination-items`);

        paginationItemsWrapper.css({
            transform: `translateX(-${_curentTransformOffset}px)`,
        });
    }

    /**
     * Initialize pagination items state.
     */
    function _initPaginationItemsState() {
        let minRange = lx.activeIndex - EDGE_FROM_ACTIVE_INDEX;
        let maxRange = lx.activeIndex + EDGE_FROM_ACTIVE_INDEX;

        if (minRange < 0) {
            for (let i = minRange; i < 0; i++) {
                minRange++;
                maxRange++;
            }
        } else if (maxRange > lx.slidesCount - 1) {
            for (let i = maxRange; i > lx.slidesCount - 1; i--) {
                minRange--;
                maxRange--;
            }
        }

        lx.paginationItemsVisibleRange = [minRange, maxRange];

        _curentTransformOffset = PAGINATION_ITEM_SIZE * minRange;

        _movePaginationWrapper();
    }

    /**
     * Set pagination items range.
     */
    function _setPaginationItemsRange() {
        const range = [];

        for (let i = 0; i < lx.slidesCount; i++) {
            range.push(i);
        }

        lx.paginationItemsRange = range;
    }

    /**
     * Update pagination items state on slide change.
     */
    function _updatePaginationItemsState() {
        const firstSlideIndex = 0;
        const lastSlideIndex = lx.slidesCount - 1;

        let [minRange, maxRange] = lx.paginationItemsVisibleRange;

        if (lx.activeIndex > _currentIndex) {
            if (lx.activeIndex === maxRange && lx.activeIndex !== lastSlideIndex) {
                minRange++;
                maxRange++;

                _curentTransformOffset += PAGINATION_ITEM_SIZE;
            }
        } else if (lx.activeIndex < _currentIndex) {
            if (lx.activeIndex === minRange && lx.activeIndex !== firstSlideIndex) {
                minRange--;
                maxRange--;

                _curentTransformOffset -= PAGINATION_ITEM_SIZE;
            }
        }

        lx.paginationItemsVisibleRange = [minRange, maxRange];

        _movePaginationWrapper();
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get slideshow controls classes.
     *
     * @return {Array} The list of slideshow controls classes.
     */
    function getClasses() {
        const classes = [];

        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;
        classes.push(`${CSS_PREFIX}-slideshow-controls--theme-${theme}`);

        if (lx.slidesCount > lx.paginationItemsMax) {
            classes.push(`${CSS_PREFIX}-slideshow-controls--has-infinite-pagination`);
        }

        if (lx.customColors) {
            classes.push(`${CSS_PREFIX}-custom-colors`);
        }

        return classes;
    }

    /**
     * Go to the given slide index.
     *
     * @param {number} newIndex The new slide index.
     */
    function goToSlide(newIndex) {
        lx.activeIndex = newIndex;

        if (angular.isFunction(lx.onPaginationClick)) {
            lx.onPaginationClick();
        }
    }

    /**
     * Check if the pagination item is on edge, indicating other slides after or before.
     *
     * @param  {number}  index The index of the pagination item to check.
     * @return {boolean} Whether the pagination item is on edge or not.
     */
    function isPaginationItemOnEdge(index) {
        return index !== 0 && index !== lx.slidesCount - 1 && lx.paginationItemsVisibleRange.includes(index);
    }

    /**
     * Check if the pagination item is out of the visible range.
     *
     * @param  {number}  index The index of the pagination item to check.
     * @return {boolean} Whether the pagination item is out of the visible range or not.
     */
    function isPaginationItemOutVisibleRange(index) {
        return index < lx.paginationItemsVisibleRange[0] || index > lx.paginationItemsVisibleRange[1];
    }

    /**
     * Go to next slide.
     */
    function nextSlide() {
        if (lx.activeIndex + 1 === lx.slidesCount) {
            lx.activeIndex = 0;
        } else {
            lx.activeIndex++;
        }

        if (angular.isFunction(lx.onNextClick)) {
            lx.onNextClick();
        }
    }

    /**
     * Go to previous slide.
     */
    function previousSlide() {
        if (lx.activeIndex === 0) {
            lx.activeIndex = lx.slidesCount - 1;
        } else {
            lx.activeIndex--;
        }

        if (angular.isFunction(lx.onPreviousClick)) {
            lx.onPreviousClick();
        }
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.goToSlide = goToSlide;
    lx.isPaginationItemOnEdge = isPaginationItemOnEdge;
    lx.isPaginationItemOutVisibleRange = isPaginationItemOutVisibleRange;
    lx.nextSlide = nextSlide;
    lx.previousSlide = previousSlide;

    /////////////////////////////
    //                         //
    //        Watchers         //
    //                         //
    /////////////////////////////

    /**
     * Watch for any changes of the active index to update pagination items.
     *
     * @param {number} newIndex The new slide index.
     */
    $scope.$watch('lx.activeIndex', (newIndex, oldIndex) => {
        if (angular.isUndefined(newIndex)) {
            return;
        }

        _setPaginationItemsRange();

        if (lx.slidesCount > lx.paginationItemsMax) {
            const firstSlideIndex = 0;
            const lastSlideIndex = lx.slidesCount - 1;

            if (
                newIndex === oldIndex ||
                (oldIndex === firstSlideIndex && newIndex === lastSlideIndex) ||
                (oldIndex === lastSlideIndex && newIndex === firstSlideIndex)
            ) {
                _initPaginationItemsState();
            } else {
                _updatePaginationItemsState();
            }
        }

        _currentIndex = lx.activeIndex;
    });
}

/////////////////////////////

function SlideshowControlsDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: SlideshowControlsController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            activeIndex: '=?lxActiveIndex',
            customColors: '=?lxCustomColors',
            onNextClick: '&?lxOnNextClick',
            onPaginationClick: '&?lxOnPaginationClick',
            onPreviousClick: '&?lxOnPreviousClick',
            slidesCount: '=lxSlidesCount',
            theme: '@?lxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.slideshow').directive('lxSlideshowControls', SlideshowControlsDirective);

/////////////////////////////

export { SlideshowControlsDirective };
