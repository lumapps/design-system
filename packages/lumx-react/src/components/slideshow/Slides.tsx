import React, { CSSProperties, forwardRef } from 'react';

import classNames from 'classnames';

import { FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { Theme } from '@lumx/react';

export interface SlidesProps extends GenericProps {
    /** current slide active */
    activeIndex?: number;
    /** slides id to be added to the wrapper */
    id?: string;
    /** callback to set a reference to the slideshow */
    setSlideshow: (slideshow: HTMLDivElement | undefined) => void;
    /** custom classname */
    className?: string;
    /** custom theme */
    theme?: Theme;
    /** Whether the automatic rotation of the slideshow is enabled or not. */
    autoPlay?: boolean;
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** Number of slides to group together. */
    groupBy?: number;
    /** Interval between each slide when automatic rotation is enabled. */
    interval?: number;
    /** whether the slides are currently playing or not */
    isAutoPlaying?: boolean;
    /** id to be passed in into the slides */
    slidesId?: string;
    /** callback to change whether the slideshow is playing or not */
    setIsAutoPlaying: (isAutoPlaying: boolean) => void;
    /** starting visible index */
    startIndexVisible: number;
    /** ending visible index */
    endIndexVisible: number;
    /** component to be rendered after the slides */
    afterSlides?: React.ReactNode;
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
export const Slides: Comp<any, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        activeIndex,
        id,
        setSlideshow,
        className,
        theme,
        fillHeight,
        groupBy,
        isAutoPlaying,
        autoPlay,
        slidesId,
        setIsAutoPlaying,
        startIndexVisible,
        endIndexVisible,
        children,
        afterSlides,
        interval,
        ...forwardedProps
    } = props;
    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties = { transform: `translateX(-${FULL_WIDTH_PERCENT * activeIndex}%)` };

    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
        <section
            id={id}
            ref={mergeRefs(ref, setSlideshow)}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--fill-height`]: fillHeight,
                [`${CLASSNAME}--group-by-${groupBy}`]: Boolean(groupBy),
            })}
            aria-roledescription="carousel"
            aria-live={isAutoPlaying ? 'off' : 'polite'}
        >
            <div
                id={slidesId}
                className={`${CLASSNAME}__slides`}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(Boolean(autoPlay))}
            >
                <div className={`${CLASSNAME}__wrapper`} style={wrapperStyle}>
                    {React.Children.map(children, (child: React.ReactNode, index: number) => {
                        if (React.isValidElement(child)) {
                            const isCurrentlyVisible = index >= startIndexVisible && index < endIndexVisible;

                            return React.cloneElement(child, {
                                isCurrentlyVisible,
                                interval,
                            });
                        }

                        return null;
                    })}
                </div>
            </div>

            {afterSlides}
        </section>
    );
});

Slides.displayName = COMPONENT_NAME;
Slides.className = CLASSNAME;