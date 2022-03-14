import React, { forwardRef } from 'react';

import { SlideshowControls, SlideshowControlsProps, Theme, Slides } from '@lumx/react';
import { DEFAULT_OPTIONS } from '@lumx/react/hooks/useSlideshowControls';
import { Comp, GenericProps, getRootClassName } from '@lumx/react/utils';

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
    /** slideshow HTML id attribute */
    id?: string;
    /** slides wrapper HTML id attribute */
    slidesId?: string;
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
    ...DEFAULT_OPTIONS,
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
        id,
        slidesId,
        ...forwardedProps
    } = props;
    // Number of slideshow items.
    const itemsCount = React.Children.count(children);

    const {
        activeIndex: currentIndex,
        slideshowId,
        setSlideshow,
        isAutoPlaying,
        slideshowSlidesId,
        setIsAutoPlaying,
        startIndexVisible,
        endIndexVisible,
        slidesCount,
        onNextClick,
        onPaginationClick,
        onPreviousClick,
        slideshow,
    } = SlideshowControls.useSlideshowControls({
        activeIndex,
        defaultActiveIndex: DEFAULT_PROPS.activeIndex as number,
        autoPlay: Boolean(autoPlay),
        itemsCount,
        groupBy,
        id,
        interval,
        onChange,
        slidesId,
    });

    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
        <Slides
            activeIndex={currentIndex}
            slideshowId={slideshowId}
            setSlideshow={setSlideshow}
            className={className}
            theme={theme}
            fillHeight={fillHeight}
            groupBy={groupBy}
            isAutoPlaying={isAutoPlaying}
            autoPlay={autoPlay}
            slideshowSlidesId={slideshowSlidesId}
            setIsAutoPlaying={setIsAutoPlaying}
            startIndexVisible={startIndexVisible}
            endIndexVisible={endIndexVisible}
            children={children}
            afterSlides={slideshowControlsProps && slidesCount > 1 ? (
                <div className={`${CLASSNAME}__controls`}>
                    <SlideshowControls
                        {...slideshowControlsProps}
                        activeIndex={currentIndex}
                        onPaginationClick={onPaginationClick}
                        onNextClick={onNextClick}
                        onPreviousClick={onPreviousClick}
                        slidesCount={slidesCount}
                        parentRef={slideshow}
                        theme={theme}
                        nextButtonProps={{
                            'aria-controls': slideshowSlidesId,
                            ...slideshowControlsProps.nextButtonProps,
                        }}
                        previousButtonProps={{
                            'aria-controls': slideshowSlidesId,
                            ...slideshowControlsProps.previousButtonProps,
                        }}
                    />
                </div>
            ) : undefined}
            {...forwardedProps}
        />
    );
});

Slideshow.displayName = COMPONENT_NAME;
Slideshow.className = CLASSNAME;
Slideshow.defaultProps = DEFAULT_PROPS;
