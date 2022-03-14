import React, { CSSProperties, forwardRef } from 'react';

import classNames from 'classnames';

import { FULL_WIDTH_PERCENT } from '@lumx/react/components/slideshow/constants';
import { Comp, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

export interface SlidesProps {

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
        slideshowId,
        setSlideshow,
        className,
        theme,
        fillHeight,
        groupBy,
        isAutoPlaying,
        autoPlay,
        slideshowSlidesId,
        setIsAutoPlaying,
        startIndexVisible,
        endIndexVisible,
        children,
        afterSlides,
        ...forwardedProps
    } = props;
    // Inline style of wrapper element.
    const wrapperStyle: CSSProperties = { transform: `translateX(-${FULL_WIDTH_PERCENT * activeIndex}%)` };

    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
        <section
            id={slideshowId}
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
                id={slideshowSlidesId}
                className={`${CLASSNAME}__slides`}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(Boolean(autoPlay))}
            >
                <div className={`${CLASSNAME}__wrapper`} style={wrapperStyle}>
                    {React.Children.map(children, (child: React.ReactNode, index: number) => {
                        if (React.isValidElement(child)) {
                            const isCurrentlyVisible = index >= startIndexVisible && index <= endIndexVisible;

                            return React.cloneElement(child, {
                                style: !isCurrentlyVisible
                                    ? { visibility: 'hidden', ...(child.props.style || {}) }
                                    : child.props.style || {},
                                'aria-hidden': !isCurrentlyVisible,
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
