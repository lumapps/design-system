import React, { Children, CSSProperties } from 'react';

import chunk from 'lodash/chunk';

import { FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { buildSlideShowGroupId, SlideshowItemGroup } from './SlideshowItemGroup';
import { useSlideScroll } from './useSlideScroll';

export interface SlidesCommonProps extends GenericProps, HasTheme {
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

interface SlidesTransformProps extends SlidesCommonProps {
    mode?: 'transform';
}

interface SlidesScrollSnapProps extends SlidesCommonProps {
    mode: 'scroll-snap';
    onChange: (index: number) => void;
}

export type SlidesProps = SlidesTransformProps | SlidesScrollSnapProps;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Slideshow';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-slideshow';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SlidesProps> = {
    mode: 'transform',
};

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
        mode = DEFAULT_PROPS.mode,
        onChange,
        ...forwardedProps
    } = props;
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const startIndexVisible = activeIndex;
    const endIndexVisible = startIndexVisible + 1;

    useSlideScroll({ activeIndex, enabled: mode === 'scroll-snap', wrapperRef, onChange });

    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties | undefined =
        mode === 'transform' ? { transform: `translateX(-${FULL_WIDTH_PERCENT * activeIndex}%)` } : undefined;

    const groups = React.useMemo(() => {
        const childrenArray = Children.toArray(children);
        return groupBy && groupBy > 1 ? chunk(childrenArray, groupBy) : childrenArray;
    }, [children, groupBy]);

    return (
        <section
            id={id}
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
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
                <div
                    ref={wrapperRef}
                    className={`${CLASSNAME}__wrapper ${CLASSNAME}__wrapper--mode-${mode}`}
                    style={wrapperStyle}
                >
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
