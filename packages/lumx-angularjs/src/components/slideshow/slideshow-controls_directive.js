import { CSS_PREFIX } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

import { EDGE_FROM_ACTIVE_INDEX, PAGINATION_ITEMS_MAX, PAGINATION_ITEM_SIZE } from './constants';

import template from './slideshow-controls.html';

/////////////////////////////

function SlideshowControlsController($element, $scope) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

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
    lumx.icons = {
        mdiChevronLeft,
        mdiChevronRight,
    };

    /**
     * The max number of pagination items.
     *
     * @type {number}
     */
    lumx.paginationItemsMax = PAGINATION_ITEMS_MAX;

    /**
     * The pagination items range.
     *
     * @type {Array}
     */
    lumx.paginationItemsRange = [];

    /**
     * The pagination items visible range.
     *
     * @type {Array}
     */
    lumx.paginationItemsVisibleRange = [];

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
        let minRange = lumx.activeIndex - EDGE_FROM_ACTIVE_INDEX;
        let maxRange = lumx.activeIndex + EDGE_FROM_ACTIVE_INDEX;

        if (minRange < 0) {
            for (let i = minRange; i < 0; i++) {
                minRange++;
                maxRange++;
            }
        } else if (maxRange > lumx.slidesCount - 1) {
            for (let i = maxRange; i > lumx.slidesCount - 1; i--) {
                minRange--;
                maxRange--;
            }
        }

        lumx.paginationItemsVisibleRange = [minRange, maxRange];

        _curentTransformOffset = PAGINATION_ITEM_SIZE * minRange;

        _movePaginationWrapper();
    }

    /**
     * Set pagination items range.
     */
    function _setPaginationItemsRange() {
        const range = [];

        for (let i = 0; i < lumx.slidesCount; i++) {
            range.push(i);
        }

        lumx.paginationItemsRange = range;
    }

    /**
     * Update pagination items state on slide change.
     */
    function _updatePaginationItemsState() {
        const firstSlideIndex = 0;
        const lastSlideIndex = lumx.slidesCount - 1;

        let [minRange, maxRange] = lumx.paginationItemsVisibleRange;

        if (lumx.activeIndex > _currentIndex) {
            if (lumx.activeIndex === maxRange && lumx.activeIndex !== lastSlideIndex) {
                minRange++;
                maxRange++;

                _curentTransformOffset += PAGINATION_ITEM_SIZE;
            }
        } else if (lumx.activeIndex < _currentIndex) {
            if (lumx.activeIndex === minRange && lumx.activeIndex !== firstSlideIndex) {
                minRange--;
                maxRange--;

                _curentTransformOffset -= PAGINATION_ITEM_SIZE;
            }
        }

        lumx.paginationItemsVisibleRange = [minRange, maxRange];

        _movePaginationWrapper();
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Go to the given slide index.
     *
     * @param {number} newIndex The new slide index.
     */
    function goToSlide(newIndex) {
        lumx.activeIndex = newIndex;

        if (angular.isFunction(lumx.onPaginationClick)) {
            lumx.onPaginationClick();
        }
    }

    /**
     * Check if the pagination item is on edge, indicating other slides after or before.
     *
     * @param  {number}  index The index of the pagination item to check.
     * @return {boolean} Whether the pagination item is on edge or not.
     */
    function isPaginationItemOnEdge(index) {
        return index !== 0 && index !== lumx.slidesCount - 1 && lumx.paginationItemsVisibleRange.includes(index);
    }

    /**
     * Check if the pagination item is out of the visible range.
     *
     * @param  {number}  index The index of the pagination item to check.
     * @return {boolean} Whether the pagination item is out of the visible range or not.
     */
    function isPaginationItemOutVisibleRange(index) {
        return index < lumx.paginationItemsVisibleRange[0] || index > lumx.paginationItemsVisibleRange[1];
    }

    /**
     * Go to next slide.
     */
    function nextSlide() {
        if (lumx.activeIndex + 1 === lumx.slidesCount) {
            lumx.activeIndex = 0;
        } else {
            lumx.activeIndex++;
        }

        if (angular.isFunction(lumx.onNextClick)) {
            lumx.onNextClick();
        }
    }

    /**
     * Go to previous slide.
     */
    function previousSlide() {
        if (lumx.activeIndex === 0) {
            lumx.activeIndex = lumx.slidesCount - 1;
        } else {
            lumx.activeIndex--;
        }

        if (angular.isFunction(lumx.onPreviousClick)) {
            lumx.onPreviousClick();
        }
    }

    /////////////////////////////

    lumx.goToSlide = goToSlide;
    lumx.isPaginationItemOnEdge = isPaginationItemOnEdge;
    lumx.isPaginationItemOutVisibleRange = isPaginationItemOutVisibleRange;
    lumx.nextSlide = nextSlide;
    lumx.previousSlide = previousSlide;

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
    $scope.$watch('lumx.activeIndex', (newIndex, oldIndex) => {
        if (angular.isUndefined(newIndex)) {
            return;
        }

        _setPaginationItemsRange();

        if (lumx.slidesCount > lumx.paginationItemsMax) {
            const firstSlideIndex = 0;
            const lastSlideIndex = lumx.slidesCount - 1;

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

        _currentIndex = lumx.activeIndex;
    });
}

/////////////////////////////

function SlideshowControlsDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: SlideshowControlsController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            activeIndex: '=?lumxActiveIndex',
            customColors: '=?lumxCustomColors',
            onNextClick: '&?lumxOnNextClick',
            onPaginationClick: '&?lumxOnPaginationClick',
            onPreviousClick: '&?lumxOnPreviousClick',
            slidesCount: '=lumxSlidesCount',
            theme: '@?lumxTheme',
        },
        template,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.slideshow`)
    .directive(`${COMPONENT_PREFIX}SlideshowControls`, SlideshowControlsDirective);

/////////////////////////////

export { SlideshowControlsDirective };
