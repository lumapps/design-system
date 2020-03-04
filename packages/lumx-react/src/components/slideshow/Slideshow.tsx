import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { AUTOPLAY_DEFAULT_INTERVAL, FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { useInterval } from '@lumx/react/hooks';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { SlideshowControls } from './SlideshowControls';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface SlideshowProps extends GenericProps {
    /** Index of the current slide */
    activeIndex?: number;
    /** Enable/disable automatic rotation of slideshow */
    autoPlay?: boolean;
    /** Whether the image has to fill its container's height. */
    fillHeight?: boolean;
    /** Enable grouping of slides */
    groupBy?: number;
    /** Enable/disable controls for slideshow */
    hasControls?: boolean;
    /** Interval between each slide when automatic rotation is enabled */
    interval?: number;
    /** Theme */
    theme?: Theme;
    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<SlideshowProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Slideshow`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    activeIndex: 0,
    autoPlay: false,
    fillHeight: false,
    groupBy: 1,
    hasControls: false,
    interval: AUTOPLAY_DEFAULT_INTERVAL,
    theme: Theme.light,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Displays a slideshow.
 */
const Slideshow: React.FC<SlideshowProps> = ({
    activeIndex = DEFAULT_PROPS.activeIndex as number,
    autoPlay = DEFAULT_PROPS.autoPlay,
    children,
    className = '',
    fillHeight = DEFAULT_PROPS.fillHeight,
    groupBy = DEFAULT_PROPS.groupBy as number,
    hasControls = DEFAULT_PROPS.hasControls,
    interval = DEFAULT_PROPS.interval as number,
    theme = DEFAULT_PROPS.theme,
    useCustomColors,
    ...props
}) => {
    const [currentIndex, setCurrentIndex] = useState(activeIndex);
    const [isAutoPlaying, setIsAutoPlaying] = useState(Boolean(autoPlay));
    const parentRef: React.MutableRefObject<null> = useRef(null);

    /**
     * The number of slideshow items.
     *
     */
    const itemsCount: number = React.Children.count(children);

    /**
     * Number of slides when using groupBy prop.
     */
    const slidesCount: number = Math.ceil(itemsCount / groupBy);

    /**
     * Inline style of wrapper element.
     */
    const wrapperSyle: CSSProperties = {
        transform: `translateX(-${FULL_WIDTH_PERCENT * currentIndex}%)`,
    };

    useEffect(() => {
        if (currentIndex > slidesCount - 1) {
            setCurrentIndex(DEFAULT_PROPS.activeIndex!);
        }
    }, [currentIndex]);

    /**
     * Start automatic rotation of slideshow.
     */
    useInterval(
        () => {
            goToNextSlide();
        },
        isAutoPlaying && slidesCount > 1 ? interval : null,
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
        [currentIndex, isAutoPlaying, slidesCount, setCurrentIndex, setIsAutoPlaying],
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

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--fill-height`]: fillHeight,
                [`${CLASSNAME}--group-by-${groupBy}`]: Boolean(groupBy),
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
            {...props}
            tabIndex={0}
            ref={parentRef}
        >
            <div className={`${CLASSNAME}__slides`}>
                <div className={`${CLASSNAME}__wrapper`} style={wrapperSyle}>
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
                    />
                </div>
            )}
        </div>
    );
};
Slideshow.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Slideshow, SlideshowProps };
