import React, { Children, CSSProperties } from 'react';

import classNames from 'classnames';

import { FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { chunk } from '@lumx/core/js/utils/collection/chunk';

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
    /** Children */
    children?: React.ReactNode;
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
export const Slides = forwardRef<SlidesProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme();
    const {
        activeIndex,
        id,
        className,
        theme = defaultTheme,
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
    const startIndexVisible = activeIndex;
    const endIndexVisible = startIndexVisible + 1;

    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties = { transform: `translateX(-${FULL_WIDTH_PERCENT * activeIndex}%)` };

    const groups = React.useMemo(() => {
        const childrenArray = Children.toArray(children);
        return groupBy && groupBy > 1 ? chunk(childrenArray, groupBy) : childrenArray;
    }, [children, groupBy]);

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
                            isDisplayed={index >= startIndexVisible && index < endIndexVisible}
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
