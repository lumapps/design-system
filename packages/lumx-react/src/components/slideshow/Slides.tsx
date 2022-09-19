import React, { Children, CSSProperties, forwardRef } from 'react';
import chunk from 'lodash/chunk';

import classNames from 'classnames';

import { FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, HasTheme } from '@lumx/react/utils';
import { useSlideFocusManagement } from './useSlideFocusManagement';
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
     * */
    slideGroupLabel?: (groupPosition: number, groupTotal: number) => string;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Slideshow';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    useSlideFocusManagement({ wrapperRef, activeIndex, groupBy });

    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties = { transform: `translateX(-${FULL_WIDTH_PERCENT * activeIndex}%)` };

    const groups = React.useMemo(
        () => (groupBy && groupBy > 1 ? chunk(Children.toArray(children), groupBy) : [children]),
        [children, groupBy],
    );

    return (
        <section
            id={id}
            ref={ref}
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
                <div ref={wrapperRef} className={`${CLASSNAME}__wrapper`} style={wrapperStyle}>
                    {groups.map((group, index) => (
                        <SlideshowItemGroup
                            key={index}
                            id={slidesId && buildSlideShowGroupId(slidesId, index)}
                            role={hasControls ? 'tabpanel' : 'group'}
                            label={slideGroupLabel ? slideGroupLabel(index + 1, groups.length) : undefined}
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
