import React, { RefObject, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import range from 'lodash/range';

import { mdiChevronLeft, mdiChevronRight, mdiPlayCircleOutline, mdiPauseCircleOutline } from '@lumx/icons';
import { Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import type { GenericProps, HasTheme, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { WINDOW } from '@lumx/react/constants';
import { useSlideshowControls, DEFAULT_OPTIONS } from '@lumx/react/hooks/useSlideshowControls';
import { useRovingTabIndex } from '@lumx/react/hooks/useRovingTabIndex';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { useSwipeNavigate } from './useSwipeNavigate';
import { PAGINATION_ITEM_SIZE, PAGINATION_ITEMS_MAX } from './constants';
import { usePaginationVisibleRange } from './usePaginationVisibleRange';

/**
 * Defines the props of the component.
 */
export interface SlideshowControlsProps extends GenericProps, HasTheme {
    /** Index of the current slide. */
    activeIndex?: number;
    /** Props to pass to the next button (minus those already set by the SlideshowControls props). */
    nextButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** Reference to the parent element on which we want to listen touch swipe. */
    parentRef?: RefObject<HTMLDivElement> | HTMLDivElement | null;
    /** Props to pass to the previous button (minus those already set by the SlideshowControls props). */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** Props to pass to the pagination wrapper */
    paginationProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'role'>;
    /** Number of slides. */
    slidesCount: number;
    /** On next button click callback. */
    onNextClick?(loopback?: boolean): void;
    /** On pagination change callback. */
    onPaginationClick?(index: number): void;
    /** On previous button click callback. */
    onPreviousClick?(loopback?: boolean): void;
    /** whether the slideshow is currently playing */
    isAutoPlaying?: boolean;
    /**
     * function to be executed in order to retrieve the label for the pagination item
     * @deprecated Use paginationItemProps instead.
     * */
    paginationItemLabel?: (index: number) => string;
    /**
     * function to be executed in order to retrieve the props for a pagination item.
     */
    paginationItemProps?: (itemIndex: number) => React.HTMLAttributes<HTMLButtonElement> & { label?: string };
    /** Props to pass to the lay button (minus those already set by the SlideshowControls props). */
    playButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SlideshowControls';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-slideshow-controls';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SlideshowControlsProps> = {
    activeIndex: 0,
};

/**
 * SlideshowControls component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const InternalSlideshowControls = forwardRef<SlideshowControlsProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        activeIndex,
        className,
        nextButtonProps,
        onNextClick,
        onPaginationClick,
        onPreviousClick,
        parentRef,
        previousButtonProps,
        paginationProps,
        slidesCount,
        theme = defaultTheme,
        isAutoPlaying = false,
        playButtonProps,
        paginationItemLabel,
        paginationItemProps,
        ...forwardedProps
    } = props;

    let parent;
    if (WINDOW) {
        // Checking window object to avoid errors in SSR.
        parent = parentRef instanceof HTMLElement ? parentRef : parentRef?.current;
    }
    const paginationRef = React.useRef(null);
    // Listen to touch swipe navigate left & right.
    useSwipeNavigate(
        parent,
        // Go next without loopback.
        useCallback(() => onNextClick?.(false), [onNextClick]),
        // Go previous without loopback.
        useCallback(() => onPreviousClick?.(false), [onPreviousClick]),
    );

    /**
     * Add roving tab index pattern to pagination items and activate slide on focus.
     */
    useRovingTabIndex({
        parentRef: paginationRef,
        elementSelector: 'button',
        keepTabIndex: true,
        onElementFocus: (element) => {
            element.click();
        },
    });

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
            />
            <div ref={paginationRef} className={`${CLASSNAME}__pagination`}>
                <div
                    className={`${CLASSNAME}__pagination-items`}
                    style={wrapperStyle}
                    role="tablist"
                    {...paginationProps}
                >
                    {useMemo(
                        () =>
                            range(slidesCount).map((index) => {
                                const isOnEdge =
                                    index !== 0 &&
                                    index !== slidesCount - 1 &&
                                    (index === visibleRange.min || index === visibleRange.max);
                                const isActive = activeIndex === index;
                                const isOutRange = index < visibleRange.min || index > visibleRange.max;
                                const {
                                    className: itemClassName = undefined,
                                    label = undefined,
                                    ...itemProps
                                } = paginationItemProps ? paginationItemProps(index) : {};

                                const ariaLabel =
                                    label || paginationItemLabel?.(index) || `${index + 1} / ${slidesCount}`;

                                return (
                                    <button
                                        className={classNames(
                                            handleBasicClasses({
                                                prefix: `${CLASSNAME}__pagination-item`,
                                                isActive,
                                                isOnEdge,
                                                isOutRange,
                                            }),
                                            itemClassName,
                                        )}
                                        key={index}
                                        type="button"
                                        tabIndex={isActive ? undefined : -1}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => onPaginationClick?.(index)}
                                        aria-label={ariaLabel}
                                        {...itemProps}
                                    />
                                );
                            }),
                        [
                            slidesCount,
                            visibleRange.min,
                            visibleRange.max,
                            activeIndex,
                            paginationItemProps,
                            paginationItemLabel,
                            onPaginationClick,
                        ],
                    )}
                </div>
            </div>

            {playButtonProps ? (
                <IconButton
                    {...playButtonProps}
                    icon={isAutoPlaying ? mdiPauseCircleOutline : mdiPlayCircleOutline}
                    className={`${CLASSNAME}__play`}
                    color={theme === Theme.dark ? 'light' : 'dark'}
                    emphasis={Emphasis.low}
                />
            ) : null}

            <IconButton
                {...nextButtonProps}
                icon={mdiChevronRight}
                className={`${CLASSNAME}__navigation`}
                color={theme === Theme.dark ? 'light' : 'dark'}
                emphasis={Emphasis.low}
                onClick={onNextClick}
            />
        </div>
    );
});

InternalSlideshowControls.displayName = COMPONENT_NAME;
InternalSlideshowControls.className = CLASSNAME;
InternalSlideshowControls.defaultProps = DEFAULT_PROPS;

export const SlideshowControls = Object.assign(InternalSlideshowControls, {
    useSlideshowControls,
    useSlideshowControlsDefaultOptions: DEFAULT_OPTIONS,
});
