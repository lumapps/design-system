import React from 'react';

import { SlideshowControls, SlideshowControlsProps, Theme, Slides, SlidesProps } from '@lumx/react';
import { DEFAULT_OPTIONS } from '@lumx/react/hooks/useSlideshowControls';
import { GenericProps } from '@lumx/react/utils/type';
import { useFocusWithin } from '@lumx/react/hooks/useFocusWithin';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { buildSlideShowGroupId } from './SlideshowItemGroup';

/**
 * Defines the props of the component.
 */
export interface SlideshowProps
    extends GenericProps,
        Pick<SlidesProps, 'autoPlay' | 'slidesId' | 'id' | 'theme' | 'fillHeight' | 'groupBy' | 'slideGroupLabel'> {
    /** current slide active */
    activeIndex?: SlidesProps['activeIndex'];
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
};

/**
 * Slideshow component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Slideshow = forwardRef<SlideshowProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
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
        theme = defaultTheme,
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
                                          onClick: toggleForcePause,
                                          ...slideshowControlsProps.playButtonProps,
                                      }
                                    : undefined
                            }
                            paginationItemProps={(index) => ({
                                'aria-controls': buildSlideShowGroupId(slideshowSlidesId, index),
                                ...slideshowControlsProps.paginationItemProps?.(index),
                            })}
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
