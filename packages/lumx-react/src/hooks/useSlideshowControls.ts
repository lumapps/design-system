import { useState, useCallback, useEffect } from 'react';

import { useInterval } from '@lumx/react/hooks/useInterval';
import { AUTOPLAY_DEFAULT_INTERVAL } from '@lumx/react/components/slideshow/constants';
import { useId } from '@lumx/react/hooks/useId';

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
    onPreviousClick: (loopback: boolean) => void;
    /** callback that triggers the next slide while using the slideshow controls */
    onNextClick: (loopback: boolean) => void;
    /** callback that triggers a specific page while using the slideshow controls */
    onPaginationClick: (index: number) => void;
    /** whether the slideshow is autoplaying or not */
    isAutoPlaying: boolean;
    /** whether the slideshow was force paused or not */
    isForcePaused: boolean;
    /** callback to change whether the slideshow is autoplaying or not */
    toggleAutoPlay: () => void;
    /** calback to change whether the slideshow should be force paused or not */
    toggleForcePause: () => void;
    /** current active slide index  */
    activeIndex: number;
    /** set the current index as the active one */
    setActiveIndex: (index: number) => void;
    /** callback that stops the auto play */
    stopAutoPlay: () => void;
    /** callback that starts the auto play */
    startAutoPlay: () => void;
}

export const DEFAULT_OPTIONS = {
    activeIndex: 0,
    groupBy: 1,
    interval: AUTOPLAY_DEFAULT_INTERVAL,
} as const;

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

    // Change current index to display next slide.
    const goToNextSlide = useCallback(
        (loopback = true) => {
            setCurrentIndex((index) => {
                if (loopback && index === slidesCount - 1) {
                    // Loopback to the start.
                    return 0;
                }
                if (index < slidesCount - 1) {
                    // Next slide.
                    return index + 1;
                }
                return index;
            });
        },
        [slidesCount, setCurrentIndex],
    );

    // Change current index to display previous slide.
    const goToPreviousSlide = useCallback(
        (loopback = true) => {
            setCurrentIndex((index) => {
                if (loopback && index === 0) {
                    // Loopback to the end.
                    return slidesCount - 1;
                }
                if (index > 0) {
                    // Previous slide.
                    return index - 1;
                }
                return index;
            });
        },
        [slidesCount, setCurrentIndex],
    );

    // Auto play
    const [isAutoPlaying, setIsAutoPlaying] = useState(Boolean(autoPlay));
    const [isForcePaused, setIsForcePaused] = useState(false);

    const isSlideshowAutoPlaying = isForcePaused ? false : isAutoPlaying;
    // Start
    useInterval(goToNextSlide, isSlideshowAutoPlaying && slidesCount > 1 ? (interval as number) : null);

    // Reset current index if it become invalid.
    useEffect(() => {
        if (currentIndex > slidesCount - 1) {
            setCurrentIndex(defaultActiveIndex as number);
        }
    }, [currentIndex, slidesCount, defaultActiveIndex]);

    const startAutoPlay = () => {
        setIsAutoPlaying(Boolean(autoPlay));
    };

    const stopAutoPlay = () => {
        setIsAutoPlaying(false);
    };

    // Handle click on a bullet to go to a specific slide.
    const onPaginationClick = useCallback(
        (index: number) => {
            stopAutoPlay();
            setIsForcePaused(true);

            if (index >= 0 && index < slidesCount) {
                setCurrentIndex(index);
            }
        },
        [slidesCount, setCurrentIndex],
    );

    // Handle click or keyboard event to go to next slide.
    const onNextClick = useCallback(
        (loopback = true) => {
            stopAutoPlay();
            setIsForcePaused(true);
            goToNextSlide(loopback);
        },
        [goToNextSlide],
    );

    // Handle click or keyboard event to go to previous slide.
    const onPreviousClick = useCallback(
        (loopback = true) => {
            stopAutoPlay();
            setIsForcePaused(true);
            goToPreviousSlide(loopback);
        },
        [goToPreviousSlide],
    );

    // If the activeIndex props changes, update the current slide
    useEffect(() => {
        setCurrentIndex(activeIndex as number);
    }, [activeIndex]);

    // If the slide changes, with autoplay for example, trigger "onChange"
    useEffect(() => {
        if (!onChange) return;
        onChange(currentIndex);
    }, [currentIndex, onChange]);

    const generatedSlideshowId = useId();
    const slideshowId = id || generatedSlideshowId;

    const generatedSlidesId = useId();
    const slideshowSlidesId = slidesId || generatedSlidesId;

    const toggleAutoPlay = () => {
        if (isSlideshowAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    };

    const toggleForcePause = () => {
        const shouldBePaused = !isForcePaused;

        setIsForcePaused(shouldBePaused);

        if (!shouldBePaused) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    };

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
        setActiveIndex: setCurrentIndex,
        startAutoPlay,
        stopAutoPlay,
        isForcePaused,
        toggleForcePause,
    };
};
