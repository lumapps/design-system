import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { clamp } from '@lumx/react';
import { useInterval } from '@lumx/react/hooks/useInterval';
import { useId } from '@lumx/react/hooks/useId';

import { AUTOPLAY_DEFAULT_INTERVAL, NEXT_SLIDE_EVENT, PREV_SLIDE_EVENT } from './constants';

export interface UseSlideshowControlsOptions {
    /** default active index to be displayed */
    defaultActiveIndex?: number;
    /** total slides to display */
    itemsCount: number;
    /** Index of the current slide. */
    activeIndex?: number;
    /** Whether the automatic rotation of the slideshow is enabled or not. */
    autoPlay?: boolean;
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** Number of slides to group together. */
    groupBy?: number;
    /** Interval between each slide when automatic rotation is enabled. */
    interval?: number;
    /** Callback when slide changes */
    onChange?(index: number): void;
    /** slideshow HTML id attribute */
    id?: string;
    /** slides wrapper HTML id attribute */
    slidesId?: string;
}

export interface UseSlideshowControls {
    /** Index for the first visible slide, should be used when groupBy is passed in */
    startIndexVisible: number;
    /** Index for the last visible slide, should be used when groupBy is passed in */
    endIndexVisible: number;
    /** total slides to be displayed */
    slidesCount: number;
    /** callback to set  */
    setSlideshow: (element: HTMLDivElement | null) => void;
    /** reference to the slideshow element */
    slideshow: HTMLDivElement | null;
    /** id to be used for the slideshow */
    slideshowId: string;
    /** id to be used for the wrapper that contains the slides */
    slideshowSlidesId: string;
    /** callback that triggers the previous slide while using the slideshow controls  */
    onPreviousClick: (loopBack: boolean) => void;
    /** callback that triggers the next slide while using the slideshow controls */
    onNextClick: (loopBack: boolean) => void;
    /** callback that triggers a specific page while using the slideshow controls */
    onPaginationClick: (index: number) => void;
    /** whether the slideshow is autoplaying or not */
    isAutoPlaying: boolean;
    /** whether the slideshow was force paused or not */
    isForcePaused: boolean;
    /** callback to change whether the slideshow is autoplaying or not */
    toggleAutoPlay: () => void;
    /** callback to change whether the slideshow should be force paused or not */
    toggleForcePause: () => void;
    /** current active slide index  */
    activeIndex: number;
    /** set the current index as the active one */
    setActiveIndex: (index: number) => void;
    /** callback that stops the autoplay */
    stopAutoPlay: () => void;
    /** callback that starts the autoplay */
    startAutoPlay: () => void;
    /** True if the last slide change is user activated */
    isUserActivated?: boolean;
}

export const DEFAULT_OPTIONS: Partial<UseSlideshowControlsOptions> = {
    activeIndex: 0,
    groupBy: 1,
    interval: AUTOPLAY_DEFAULT_INTERVAL,
};

export const useSlideshowControls = ({
    activeIndex = DEFAULT_OPTIONS.activeIndex,
    groupBy = DEFAULT_OPTIONS.groupBy,
    interval = DEFAULT_OPTIONS.interval,
    autoPlay,
    defaultActiveIndex,
    onChange,
    itemsCount,
    id,
    slidesId,
}: UseSlideshowControlsOptions): UseSlideshowControls => {
    const [currentIndex, setCurrentIndex] = useState(activeIndex as number);
    // Use state instead of a ref to make the slideshow controls update directly when the element is set.
    const [element, setElement] = useState<HTMLDivElement | null>(null);

    // Number of slides when using groupBy prop.
    const slidesCount = Math.ceil(itemsCount / Math.min(groupBy as number, itemsCount));

    // Set current active index (& if is user activated)
    const setActiveIndex = useCallback(
        (setStateAction: SetStateAction<number>, isUser?: boolean) => {
            // Store on element a boolean value when the slide change was not from a user action.
            const elementDataset = element?.dataset as any;
            if (elementDataset) {
                if (isUser) elementDataset.lumxUserActivated = true;
                else delete elementDataset.lumxUserActivated;
            }

            setCurrentIndex(setStateAction);
        },
        [element],
    );

    // Change slide given delta (-1/+1) with or without loop back.
    const goTo = useCallback(
        (delta: -1 | 1 = 1, loopBack = true, isUser?: boolean) => {
            setActiveIndex((index) => {
                if (loopBack) {
                    const newIndex = (index + delta) % slidesCount;
                    if (newIndex < 0) return slidesCount + newIndex;
                    return newIndex;
                }
                return clamp(index + delta, 0, slidesCount - 1);
            }, isUser);
        },
        [slidesCount, setActiveIndex],
    );

    // Auto play
    const [isAutoPlaying, setIsAutoPlaying] = useState(Boolean(autoPlay));
    const [isForcePaused, setIsForcePaused] = useState(false);

    const isSlideshowAutoPlaying = isForcePaused ? false : isAutoPlaying;
    // Start
    useInterval(goTo, isSlideshowAutoPlaying && slidesCount > 1 ? (interval as number) : null);

    // Reset current index if it becomes invalid.
    useEffect(() => {
        if (currentIndex > slidesCount - 1) {
            setActiveIndex(defaultActiveIndex as number);
        }
    }, [currentIndex, slidesCount, defaultActiveIndex, setActiveIndex]);

    const startAutoPlay = useCallback(() => {
        setIsAutoPlaying(Boolean(autoPlay));
    }, [autoPlay]);

    const stopAutoPlay = useCallback(() => {
        setIsAutoPlaying(false);
    }, []);

    // Handle click on a bullet to go to a specific slide.
    const onPaginationClick = useCallback(
        (index: number) => {
            stopAutoPlay();
            setIsForcePaused(true);

            if (index >= 0 && index < slidesCount) {
                setActiveIndex(index, true);
            }
        },
        [stopAutoPlay, slidesCount, setActiveIndex],
    );

    // Handle click or keyboard event to go to next slide.
    const onNextClick = useCallback(
        (loopBack = true) => {
            stopAutoPlay();
            setIsForcePaused(true);
            goTo(1, loopBack, true);
        },
        [goTo, stopAutoPlay],
    );

    // Handle click or keyboard event to go to previous slide.
    const onPreviousClick = useCallback(
        (loopBack = true) => {
            stopAutoPlay();
            setIsForcePaused(true);
            goTo(-1, loopBack, true);
        },
        [goTo, stopAutoPlay],
    );

    // Listen to custom next/prev slide events
    useEffect(() => {
        if (!element) return undefined;

        element.addEventListener(NEXT_SLIDE_EVENT, onNextClick);
        element.addEventListener(PREV_SLIDE_EVENT, onPreviousClick);
        return () => {
            element.removeEventListener(NEXT_SLIDE_EVENT, onNextClick);
            element.removeEventListener(PREV_SLIDE_EVENT, onPreviousClick);
        };
    }, [element, onNextClick, onPreviousClick]);

    // If the activeIndex props changes, update the current slide
    useEffect(() => {
        setActiveIndex(activeIndex as number);
    }, [activeIndex, setActiveIndex]);

    // If the slide changes, with autoplay for example, trigger "onChange"
    useEffect(() => {
        if (!onChange) return;
        onChange(currentIndex);
    }, [currentIndex, onChange]);

    const generatedSlideshowId = useId();
    const slideshowId = id || generatedSlideshowId;

    const generatedSlidesId = useId();
    const slideshowSlidesId = slidesId || generatedSlidesId;

    const toggleAutoPlay = useCallback(() => {
        if (isSlideshowAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }, [isSlideshowAutoPlaying, startAutoPlay, stopAutoPlay]);

    const toggleForcePause = useCallback(() => {
        const shouldBePaused = !isForcePaused;

        setIsForcePaused(shouldBePaused);

        if (!shouldBePaused) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    }, [isForcePaused, startAutoPlay, stopAutoPlay]);

    // Start index and end index of visible slides.
    const startIndexVisible = currentIndex * (groupBy as number);
    const endIndexVisible = startIndexVisible + (groupBy as number);

    return {
        startIndexVisible,
        endIndexVisible,
        setSlideshow: setElement,
        slideshow: element,
        slideshowId,
        slideshowSlidesId,
        onPreviousClick,
        onNextClick,
        onPaginationClick,
        isAutoPlaying: isSlideshowAutoPlaying,
        toggleAutoPlay,
        activeIndex: currentIndex,
        slidesCount,
        setActiveIndex,
        startAutoPlay,
        stopAutoPlay,
        isForcePaused,
        toggleForcePause,
    };
};
