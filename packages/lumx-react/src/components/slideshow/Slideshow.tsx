import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { IconButtonProps, Theme } from '@lumx/react';

import { AUTOPLAY_DEFAULT_INTERVAL, FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { useInterval } from '@lumx/react/hooks';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { SlideshowControls } from './SlideshowControls';

/**
 * Defines the props of the component.
 */
export interface SlideshowProps extends GenericProps {
    /** The index of the current slide. */
    activeIndex?: number;
    /** Whether the automatic rotation of the slideshow is enabled or not. */
    autoPlay?: boolean;
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** The number of slides to group together. */
    groupBy?: number;
    /** Whether slideshow has controls or not. */
    hasControls?: boolean;
    /** The interval between each slide when automatic rotation is enabled. */
    interval?: number;
    /** The props to pass to the next button, minus those already set by the SlideshowControls props. */
    nextButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** The props to pass to the previous button, minus those already set by the SlideshowControls props. */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** Callback when slide changes */
    onChange?(index: number): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Slideshow`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<SlideshowProps> = {
    activeIndex: 0,
    groupBy: 1,
    interval: AUTOPLAY_DEFAULT_INTERVAL,
    theme: Theme.light,
};

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
export const Slideshow: Comp<SlideshowProps> = ({
    activeIndex,
    autoPlay,
    children,
    className,
    fillHeight,
    groupBy,
    hasControls,
    interval,
    nextButtonProps,
    onChange,
    previousButtonProps,
    theme,
    useCustomColors,
    ...forwardedProps
}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(activeIndex as number);
    const [isAutoPlaying, setIsAutoPlaying] = useState(Boolean(autoPlay));
    const parentRef: React.MutableRefObject<null> = useRef(null);

    /**
     * The number of slideshow items.
     *
     */
    const itemsCount = React.Children.count(children);

    /**
     * Number of slides when using groupBy prop.
     */
    const slidesCount = Math.ceil(itemsCount / (groupBy as number));

    /**
     * Inline style of wrapper element.
     */
    const wrapperStyle: CSSProperties = {
        transform: `translateX(-${FULL_WIDTH_PERCENT * currentIndex}%)`,
    };

    /**
     * Change current index to display next slide.
     */
    const goToNextSlide = useCallback(() => {
        if (currentIndex === slidesCount - 1) {
            setCurrentIndex(() => 0);
        } else if (currentIndex < slidesCount - 1) {
            setCurrentIndex((index: number): number => index + 1);
        }
    }, [currentIndex, slidesCount, setCurrentIndex]);

    /**
     * Change current index to display previous slide.
     */
    const goToPreviousSlide = useCallback(() => {
        if (currentIndex === 0) {
            setCurrentIndex(() => slidesCount - 1);
        } else if (currentIndex > 0) {
            setCurrentIndex((index) => index - 1);
        }
    }, [currentIndex, slidesCount, setCurrentIndex]);

    /**
     * Stop slideshow auto rotating.
     */
    const stopAutoPlay = () => {
        setIsAutoPlaying(false);
    };

    useEffect(() => {
        if (currentIndex > slidesCount - 1) {
            setCurrentIndex(DEFAULT_PROPS.activeIndex as number);
        }
    }, [currentIndex, slidesCount]);

    /**
     * Start automatic rotation of slideshow.
     */
    useInterval(
        () => {
            goToNextSlide();
        },
        isAutoPlaying && slidesCount > 1 ? (interval as number) : null,
    );

    /**
     * Handle click on a bullet to go to a specific slide.
     */
    const handleControlGotToSlide = useCallback(
        (index: number) => {
            stopAutoPlay();

            if (currentIndex >= 0 && currentIndex < slidesCount) {
                setCurrentIndex(() => index);
            }
        },
        [currentIndex, slidesCount, setCurrentIndex],
    );

    /**
     * Handle click or keyboard event to go to next slide.
     */
    const handleControlNextSlide = () => {
        stopAutoPlay();
        goToNextSlide();
    };

    /**
     * Handle click or keyboard event to go to previous slide.
     */
    const handleControlPreviousSlide = () => {
        stopAutoPlay();
        goToPreviousSlide();
    };

    /* If the activeIndex props changes, update the current slide */
    React.useEffect(() => {
        setCurrentIndex(activeIndex as number);
    }, [activeIndex]);

    /* If the slide changes, with autoplay for example, trigger "onChange" */
    React.useEffect(() => {
        if (onChange) {
            onChange(currentIndex);
        }
    }, [currentIndex, onChange]);

    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--fill-height`]: fillHeight,
                [`${CLASSNAME}--group-by-${groupBy}`]: Boolean(groupBy),
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
            tabIndex={0}
            ref={parentRef}
        >
            <div className={`${CLASSNAME}__slides`}>
                <div className={`${CLASSNAME}__wrapper`} style={wrapperStyle}>
                    {children}
                </div>
            </div>

            {hasControls && slidesCount > 1 && (
                <div className={`${CLASSNAME}__controls`}>
                    <SlideshowControls
                        activeIndex={currentIndex}
                        onPaginationClick={handleControlGotToSlide}
                        onNextClick={handleControlNextSlide}
                        onPreviousClick={handleControlPreviousSlide}
                        slidesCount={slidesCount}
                        parentRef={parentRef}
                        theme={theme}
                        nextButtonProps={nextButtonProps}
                        previousButtonProps={previousButtonProps}
                    />
                </div>
            )}
        </div>
    );
};
Slideshow.displayName = COMPONENT_NAME;
Slideshow.className = CLASSNAME;
Slideshow.defaultProps = DEFAULT_PROPS;
