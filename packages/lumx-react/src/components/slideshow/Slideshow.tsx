import React, { forwardRef } from 'react';

import { SlideshowControls, SlideshowControlsProps, Theme, Slides, SlidesProps } from '@lumx/react';
import { Comp, GenericProps } from '@lumx/react/utils/type';
import { useFocusWithin } from '@lumx/react/hooks/useFocusWithin';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { DEFAULT_OPTIONS } from './useSlideshowControls';

/**
 * Defines the props of the component.
 */
export interface SlideshowProps
    extends GenericProps,
        Pick<SlidesProps, 'autoPlay' | 'slidesId' | 'id' | 'theme' | 'fillHeight' | 'groupBy' | 'slideGroupLabel'> {
    /** current slide active */
    activeIndex?: number;
    /** Interval between each slide when automatic rotation is enabled. */
    interval?: number;
    /** Props to pass to the slideshow controls (minus those already set by the Slideshow props). */
    slideshowControlsProps?: Pick<
        SlideshowControlsProps,
        'nextButtonProps' | 'previousButtonProps' | 'paginationItemProps'
    > &
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
    /** Callback when slide changes */
    onChange?(index: number): void;
}

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
        slideGroupLabel,
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
        slidesCount,
        onNextClick,
        onPaginationClick,
        onPreviousClick,
        slideshow,
        stopAutoPlay,
        startAutoPlay,
        toggleAutoPlay,
        toggleForcePause,
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

    useFocusWithin({
        element: slideshow,
        onFocusIn: stopAutoPlay,
        onFocusOut: startAutoPlay,
    });

    const showControls = slideshowControlsProps && slidesCount > 1;

    return (
        <Slides
            activeIndex={currentIndex}
            id={slideshowId}
            className={className}
            theme={theme}
            fillHeight={fillHeight}
            groupBy={groupBy}
            isAutoPlaying={isAutoPlaying}
            autoPlay={autoPlay}
            slidesId={slideshowSlidesId}
            toggleAutoPlay={toggleAutoPlay}
            ref={mergeRefs(ref, setSlideshow)}
            hasControls={showControls}
            slideGroupLabel={slideGroupLabel}
            afterSlides={
                slideshowControlsProps && slidesCount > 1 ? (
                    <div className={`${Slides.className}__controls`}>
                        <SlideshowControls
                            {...slideshowControlsProps}
                            activeIndex={currentIndex}
                            onPaginationClick={onPaginationClick}
                            onNextClick={onNextClick}
                            onPreviousClick={onPreviousClick}
                            slidesCount={slidesCount}
                            parentRef={slideshow}
                            theme={theme}
                            isAutoPlaying={isAutoPlaying}
                            playButtonProps={
                                autoPlay
                                    ? {
                                          onClick: toggleForcePause,
                                          ...slideshowControlsProps.playButtonProps,
                                      }
                                    : undefined
                            }
                        />
                    </div>
                ) : undefined
            }
            {...forwardedProps}
        >
            {children}
        </Slides>
    );
});

Slideshow.displayName = 'Slideshow';
Slideshow.defaultProps = DEFAULT_PROPS;
