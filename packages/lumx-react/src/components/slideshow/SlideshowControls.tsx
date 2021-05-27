import React, { forwardRef, RefObject, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import range from 'lodash/range';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { WINDOW } from '@lumx/react/constants';

import { useSwipeNavigate } from './useSwipeNavigate';
import { useKeyNavigate } from './useKeyNavigate';
import { PAGINATION_ITEM_SIZE, PAGINATION_ITEMS_MAX } from './constants';
import { usePaginationVisibleRange } from './usePaginationVisibleRange';

/**
 * Defines the props of the component.
 */
export interface SlideshowControlsProps extends GenericProps {
    /** Index of the current slide. */
    activeIndex?: number;
    /** Props to pass to the next button (minus those already set by the SlideshowControls props). */
    nextButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** Reference to the parent element on which we want to listen touch swipe. */
    parentRef?: RefObject<HTMLDivElement> | HTMLDivElement;
    /** Props to pass to the previous button (minus those already set by the SlideshowControls props). */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** Number of slides. */
    slidesCount: number;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** On next button click callback. */
    onNextClick?(loopback?: boolean): void;
    /** On pagination change callback. */
    onPaginationClick?(index: number): void;
    /** On previous button click callback. */
    onPreviousClick?(loopback?: boolean): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SlideshowControls';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SlideshowControlsProps> = {
    activeIndex: 0,
    theme: Theme.light,
};

/**
 * SlideshowControls component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SlideshowControls: Comp<SlideshowControlsProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        activeIndex,
        className,
        nextButtonProps,
        onNextClick,
        onPaginationClick,
        onPreviousClick,
        parentRef,
        previousButtonProps,
        slidesCount,
        theme,
        ...forwardedProps
    } = props;

    let parent;
    if (WINDOW) {
        // Checking window object to avoid errors in SSR.
        parent = parentRef instanceof HTMLElement ? parentRef : parentRef?.current;
    }
    // Listen to keyboard navigate left & right.
    useKeyNavigate(parent, onNextClick, onPreviousClick);
    // Listen to touch swipe navigate left & right.
    useSwipeNavigate(
        parent,
        // Go next without loopback.
        useCallback(() => onNextClick?.(false), [onNextClick]),
        // Go previous without loopback.
        useCallback(() => onPreviousClick?.(false), [onPreviousClick]),
    );

    // Pagination "bullet" range.
    const visibleRange = usePaginationVisibleRange(activeIndex as number, slidesCount);

    // Inline style of wrapper element.
    const wrapperStyle = { transform: `translateX(-${PAGINATION_ITEM_SIZE * visibleRange.min}px)` };

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--has-infinite-pagination`]: slidesCount > PAGINATION_ITEMS_MAX,
            })}
        >
            <IconButton
                {...previousButtonProps}
                icon={mdiChevronLeft}
                className={`${CLASSNAME}__navigation`}
                color={theme === Theme.dark ? 'light' : 'dark'}
                emphasis={Emphasis.low}
                onClick={onPreviousClick}
                tabIndex={-1}
            />
            <div className={`${CLASSNAME}__pagination`}>
                <div className={`${CLASSNAME}__pagination-items`} style={wrapperStyle}>
                    {useMemo(
                        () =>
                            range(slidesCount).map((index) => {
                                const isOnEdge =
                                    index !== 0 &&
                                    index !== slidesCount - 1 &&
                                    (index === visibleRange.min || index === visibleRange.max);
                                const isActive = activeIndex === index;
                                const isOutRange = index < visibleRange.min || index > visibleRange.max;
                                return (
                                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                    <button
                                        className={classNames(
                                            handleBasicClasses({
                                                prefix: `${CLASSNAME}__pagination-item`,
                                                isActive,
                                                isOnEdge,
                                                isOutRange,
                                            }),
                                        )}
                                        key={index}
                                        type="button"
                                        onClick={() => onPaginationClick?.(index)}
                                        tabIndex={-1}
                                    />
                                );
                            }),
                        [slidesCount, visibleRange.min, visibleRange.max, activeIndex, onPaginationClick],
                    )}
                </div>
            </div>
            <IconButton
                {...nextButtonProps}
                icon={mdiChevronRight}
                className={`${CLASSNAME}__navigation`}
                color={theme === Theme.dark ? 'light' : 'dark'}
                emphasis={Emphasis.low}
                onClick={onNextClick}
                tabIndex={-1}
            />
        </div>
    );
});
SlideshowControls.displayName = COMPONENT_NAME;
SlideshowControls.className = CLASSNAME;
SlideshowControls.defaultProps = DEFAULT_PROPS;
