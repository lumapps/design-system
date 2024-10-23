import React, { Children, CSSProperties, forwardRef } from 'react';
import chunk from 'lodash/chunk';

import classNames from 'classnames';

import { FULL_WIDTH_PERCENT, NEXT_SLIDE_EVENT, PREV_SLIDE_EVENT } from '@lumx/react/components/slideshow/constants';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useMergeRefs } from '@lumx/react/utils/mergeRefs';
import { useKeyNavigate } from '@lumx/react/components/slideshow/useKeyNavigate';
import { buildSlideShowGroupId, SlideshowItemGroup } from './SlideshowItemGroup';

export interface SlidesProps extends GenericProps, HasTheme {
    /** current slide active */
    activeIndex: number;
    /** slides id to be added to the wrapper */
    id?: string;
    /** Whether the automatic rotation of the slideshow is enabled or not. */
    autoPlay?: boolean;
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** Number of slides to group together. */
    groupBy?: number;
    /** whether the slides are currently playing or not */
    isAutoPlaying?: boolean;
    /** id to be passed in into the slides */
    slidesId?: string;
    /** callback to change whether the slideshow is playing or not */
    toggleAutoPlay: () => void;
    /** component to be rendered after the slides */
    afterSlides?: React.ReactNode;
    /** Whether the slides have controls linked */
    hasControls?: boolean;
    /**
     * Accessible label to set on a slide group.
     * Receives the group position starting from 1 and the total number of groups.
     */
    slideGroupLabel?: (groupPosition: number, groupTotal: number) => string;
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
 * Slides component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Slides: Comp<SlidesProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        activeIndex,
        id,
        className,
        theme,
        fillHeight,
        groupBy,
        isAutoPlaying,
        toggleAutoPlay,
        slidesId,
        children,
        afterSlides,
        hasControls,
        slideGroupLabel,
        ...forwardedProps
    } = props;
    const startIndexVisible = activeIndex;
    const endIndexVisible = startIndexVisible + 1;

    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties = { transform: `translateX(-${FULL_WIDTH_PERCENT * activeIndex}%)` };

    const groups = React.useMemo(() => {
        const childrenArray = Children.toArray(children);
        return groupBy && groupBy > 1 ? chunk(childrenArray, groupBy) : childrenArray;
    }, [children, groupBy]);

    const slidesRef = React.useRef<HTMLDivElement>(null);

    const slide = slidesRef.current;
    const onNextSlide = React.useCallback(() => slide?.dispatchEvent(new CustomEvent(NEXT_SLIDE_EVENT)), [slide]);
    const onPrevSlide = React.useCallback(() => slide?.dispatchEvent(new CustomEvent(PREV_SLIDE_EVENT)), [slide]);
    useKeyNavigate(slide, onNextSlide, onPrevSlide);

    return (
        <section
            id={id}
            ref={useMergeRefs(slidesRef, ref)}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--fill-height`]: fillHeight,
                [`${CLASSNAME}--group-by-${groupBy}`]: Boolean(groupBy),
            })}
            aria-roledescription="carousel"
        >
            <div
                id={slidesId}
                className={`${CLASSNAME}__slides`}
                onMouseEnter={toggleAutoPlay}
                onMouseLeave={toggleAutoPlay}
                aria-live={isAutoPlaying ? 'off' : 'polite'}
            >
                <div className={`${CLASSNAME}__wrapper`} style={wrapperStyle}>
                    {groups.map((group, index) => (
                        <SlideshowItemGroup
                            key={index}
                            id={slidesId && buildSlideShowGroupId(slidesId, index)}
                            label={slideGroupLabel?.(index + 1, groups.length)}
                            isDisplayed={index >= startIndexVisible && index < endIndexVisible}
                            slidesRef={slidesRef}
                        >
                            {group}
                        </SlideshowItemGroup>
                    ))}
                </div>
            </div>

            {afterSlides}
        </section>
    );
});

Slides.displayName = COMPONENT_NAME;
Slides.className = CLASSNAME;
