import React, { forwardRef } from 'react';

import { SlideshowControls, SlideshowControlsProps, Theme, Slides, SlidesProps } from '@lumx/react';
import { DEFAULT_OPTIONS } from '@lumx/react/hooks/useSlideshowControls';
import { Comp, GenericProps } from '@lumx/react/utils';
import { useFocusWithin } from '@lumx/react/hooks/useFocusWithin';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

/**
 * Defines the props of the component.
 */
export interface SlideshowProps
    extends GenericProps,
        Pick<
            SlidesProps,
            'activeIndex' | 'autoPlay' | 'fillHeight' | 'slidesId' | 'id' | 'theme' | 'fillHeight' | 'groupBy'
        > {
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
        stopAutoPlay,
        startAutoPlay,
        isForcePaused,
        setIsForcePaused,
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
            setIsAutoPlaying={setIsAutoPlaying}
            startIndexVisible={startIndexVisible}
            endIndexVisible={endIndexVisible}
            interval={interval}
            ref={mergeRefs(ref, setSlideshow)}
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
                            nextButtonProps={{
                                'aria-controls': slideshowSlidesId,
                                ...slideshowControlsProps.nextButtonProps,
                            }}
                            previousButtonProps={{
                                'aria-controls': slideshowSlidesId,
                                ...slideshowControlsProps.previousButtonProps,
                            }}
                            playButtonProps={
                                autoPlay
                                    ? {
                                          'aria-controls': slideshowSlidesId,
                                          onClick: () => setIsForcePaused(!isForcePaused),
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
