import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './slideshow-controls.html';

/////////////////////////////

function SlideshowControlsController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get a range of values based on slides count.
     * Usefull for displaying the right number of bullets.
     *
     * @return {Array} The range of values based on slides count.
     */
    function getSlidesRange() {
        const range = [];

        for (let i = 0; i < lumx.slidesCount; i++) {
            range.push(i);
        }

        return range;
    }

    /**
     * Go to the given slide index.
     *
     * @param {number} newIndex The new slide index.
     */
    function goToSlide(newIndex) {
        lumx.activeIndex = newIndex;
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
    }

    /////////////////////////////

    lumx.getSlidesRange = getSlidesRange;
    lumx.goToSlide = goToSlide;
    lumx.nextSlide = nextSlide;
    lumx.previousSlide = previousSlide;
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
            onClick: '&?lumxOnClick',
            onNextClick: '&?lumxOnNextClick',
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
