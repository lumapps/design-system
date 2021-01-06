import React, { CSSProperties, forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { SlideshowControls, SlideshowControlsProps, Theme } from '@lumx/react';

import { AUTOPLAY_DEFAULT_INTERVAL, FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { useInterval } from '@lumx/react/hooks/useInterval';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

/**
 * Defines the props of the component.
 */
export interface SlideshowProps extends GenericProps {
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
    /** Props to pass to the slideshow controls (minus those already set by the Slideshow props). */
    slideshowControlsProps?: Pick<SlideshowControlsProps, 'nextButtonProps' | 'previousButtonProps'> &
        Omit<
            SlideshowControlsProps,
            | 'activeIndex'
            | 'onPaginationClick'
            | 'onNextClick'
            | 'onPreviousClick'
            | 'slidesCount'
            | 'parentRef'
            | 'theme'
        >;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Callback when slide changes */
    onChange?(index: number): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Slideshow`;

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SlideshowProps> = {
    activeIndex: 0,
    groupBy: 1,
    interval: AUTOPLAY_DEFAULT_INTERVAL,
    theme: Theme.light,
};

/**
 * Slideshow component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Slideshow: Comp<SlideshowProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        activeIndex,
        autoPlay,
        children,
        className,
        fillHeight,
        groupBy,
        interval,
        onChange,
        slideshowControlsProps,
        theme,
        ...forwardedProps
    } = props;
    const [currentIndex, setCurrentIndex] = useState(activeIndex as number);
    const rootRef: React.MutableRefObject<null> = useRef(null);

    // Number of slideshow items.
    const itemsCount = React.Children.count(children);
    // Number of slides when using groupBy prop.
    const slidesCount = Math.ceil(itemsCount / Math.min(groupBy as number, itemsCount));
    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties = { transform: `translateX(-${FULL_WIDTH_PERCENT * currentIndex}%)` };

    // Change current index to display next slide.
    const goToNextSlide = useCallback(() => {
        if (currentIndex === slidesCount - 1) {
            setCurrentIndex(0);
        } else if (currentIndex < slidesCount - 1) {
            setCurrentIndex((index) => index + 1);
        }
    }, [currentIndex, slidesCount, setCurrentIndex]);

    // Change current index to display previous slide.
    const goToPreviousSlide = useCallback(() => {
        if (currentIndex === 0) {
            setCurrentIndex(slidesCount - 1);
        } else if (currentIndex > 0) {
            setCurrentIndex((index) => index - 1);
        }
    }, [currentIndex, slidesCount, setCurrentIndex]);

    // Auto play
    const [isAutoPlaying, setIsAutoPlaying] = useState(Boolean(autoPlay));
    // Start
    useInterval(goToNextSlide, isAutoPlaying && slidesCount > 1 ? (interval as number) : null);

    // Reset current index if it become invalid.
    useEffect(() => {
        if (currentIndex > slidesCount - 1) {
            setCurrentIndex(DEFAULT_PROPS.activeIndex as number);
        }
    }, [currentIndex, slidesCount]);

    // Handle click on a bullet to go to a specific slide.
    const handleControlGotToSlide = useCallback(
        (index: number) => {
            setIsAutoPlaying(false);

            if (index >= 0 && index < slidesCount) {
                setCurrentIndex(index);
            }
        },
        [slidesCount, setCurrentIndex],
    );

    // Handle click or keyboard event to go to next slide.
    const handleControlNextSlide = useCallback(() => {
        setIsAutoPlaying(false);
        goToNextSlide();
    }, [goToNextSlide]);

    // Handle click or keyboard event to go to previous slide.
    const handleControlPreviousSlide = useCallback(() => {
        setIsAutoPlaying(false);
        goToPreviousSlide();
    }, [goToPreviousSlide]);

    // If the activeIndex props changes, update the current slide
    useEffect(() => {
        setCurrentIndex(activeIndex as number);
    }, [activeIndex]);

    // If the slide changes, with autoplay for example, trigger "onChange"
    useEffect(() => {
        if (!onChange) return;
        onChange(currentIndex);
    }, [currentIndex, onChange]);

    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
        <div
            ref={mergeRefs(ref, rootRef)}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--fill-height`]: fillHeight,
                [`${CLASSNAME}--group-by-${groupBy}`]: Boolean(groupBy),
            })}
            tabIndex={0}
        >
            <div className={`${CLASSNAME}__slides`}>
                <div className={`${CLASSNAME}__wrapper`} style={wrapperStyle}>
                    {children}
                </div>
            </div>

            {slideshowControlsProps && slidesCount > 1 && (
                <div className={`${CLASSNAME}__controls`}>
                    <SlideshowControls
                        {...slideshowControlsProps}
                        activeIndex={currentIndex}
                        onPaginationClick={handleControlGotToSlide}
                        onNextClick={handleControlNextSlide}
                        onPreviousClick={handleControlPreviousSlide}
                        slidesCount={slidesCount}
                        parentRef={rootRef}
                        theme={theme}
                    />
                </div>
            )}
        </div>
    );
});
Slideshow.displayName = COMPONENT_NAME;
Slideshow.className = CLASSNAME;
Slideshow.defaultProps = DEFAULT_PROPS;
