import React, { CSSProperties, forwardRef, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import { SlideshowControls, SlideshowControlsProps, Theme } from '@lumx/react';

import { AUTOPLAY_DEFAULT_INTERVAL, FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
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
const COMPONENT_NAME = 'Slideshow';

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
    // Use state instead of a ref to make the slideshow controls update directly when the element is set.
    const [element, setElement] = useState<HTMLDivElement>();

    // Number of slideshow items.
    const itemsCount = React.Children.count(children);
    // Number of slides when using groupBy prop.
    const slidesCount = Math.ceil(itemsCount / Math.min(groupBy as number, itemsCount));
    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties = { transform: `translateX(-${FULL_WIDTH_PERCENT * currentIndex}%)` };

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
    const handleControlNextSlide = useCallback(
        (loopback = true) => {
            setIsAutoPlaying(false);
            goToNextSlide(loopback);
        },
        [goToNextSlide],
    );

    // Handle click or keyboard event to go to previous slide.
    const handleControlPreviousSlide = useCallback(
        (loopback = true) => {
            setIsAutoPlaying(false);
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

    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
        <div
            ref={mergeRefs(ref, setElement)}
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
                        parentRef={element}
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
