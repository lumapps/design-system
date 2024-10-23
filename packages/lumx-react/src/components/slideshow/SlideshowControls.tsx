import React, { forwardRef, RefObject, useCallback, useState } from 'react';

import classNames from 'classnames';
import range from 'lodash/range';

import { mdiChevronLeft, mdiChevronRight, mdiPlayCircleOutline, mdiPauseCircleOutline } from '@lumx/icons';
import { Emphasis, IconButton, IconButtonProps, Slides, Theme } from '@lumx/react';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { WINDOW } from '@lumx/react/constants';
import { useKeyNavigate } from '@lumx/react/components/slideshow/useKeyNavigate';
import { useMergeRefs } from '@lumx/react/utils/mergeRefs';

import { buildSlideShowGroupId } from '@lumx/react/components/slideshow/SlideshowItemGroup';
import { DEFAULT_OPTIONS, useSlideshowControls } from './useSlideshowControls';
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
    onNextClick?(loopBack?: boolean): void;
    /** On pagination change callback. */
    onPaginationClick?(index: number): void;
    /** On previous button click callback. */
    onPreviousClick?(loopBack?: boolean): void;
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
const InternalSlideshowControls: Comp<SlideshowControlsProps, HTMLDivElement> = forwardRef((props, ref) => {
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
        theme,
        isAutoPlaying = false,
        playButtonProps,
        paginationItemLabel,
        paginationItemProps,
        ...forwardedProps
    } = props;

    let parent: HTMLElement | null | undefined;
    if (WINDOW) {
        // Checking window object to avoid errors in SSR.
        parent = parentRef instanceof HTMLElement ? parentRef : parentRef?.current;
    }
    const paginationRef = React.useRef(null);
    // Listen to touch swipe navigate left & right.
    useSwipeNavigate(
        parent,
        // Go next without loop back.
        useCallback(() => onNextClick?.(false), [onNextClick]),
        // Go previous without loop back.
        useCallback(() => onPreviousClick?.(false), [onPreviousClick]),
    );

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const onButtonFocus = useCallback((index: number) => () => setFocusedIndex(index), [setFocusedIndex]);
    const onFocusOut = useCallback(() => setFocusedIndex(null), [setFocusedIndex]);

    // Pagination "bullet" range.
    const visibleRange = usePaginationVisibleRange(focusedIndex ?? (activeIndex as number), slidesCount);

    // Inline style of wrapper element.
    const wrapperStyle = { transform: `translateX(-${PAGINATION_ITEM_SIZE * visibleRange.min}px)` };

    const controlsRef = React.useRef<HTMLDivElement>(null);
    useKeyNavigate(controlsRef.current, onNextClick, onPreviousClick);

    const slideshowSlidesId = React.useMemo(() => parent?.querySelector(`.${Slides.className}__slides`)?.id, [parent]);

    return (
        <div
            ref={useMergeRefs(ref, controlsRef)}
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
                aria-controls={slideshowSlidesId}
            />

            <div ref={paginationRef} className={`${CLASSNAME}__pagination`}>
                <div
                    className={`${CLASSNAME}__pagination-items`}
                    style={wrapperStyle}
                    {...paginationProps}
                    onBlur={onFocusOut}
                >
                    {range(slidesCount).map((index) => {
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

                        const ariaLabel = label || paginationItemLabel?.(index) || `${index + 1} / ${slidesCount}`;

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
                                aria-current={isActive || undefined}
                                aria-controls={buildSlideShowGroupId(slideshowSlidesId, index)}
                                onClick={() => onPaginationClick?.(index)}
                                onFocus={onButtonFocus(index)}
                                aria-label={ariaLabel}
                                {...itemProps}
                            />
                        );
                    })}
                </div>
            </div>

            {playButtonProps ? (
                <IconButton
                    {...playButtonProps}
                    icon={isAutoPlaying ? mdiPauseCircleOutline : mdiPlayCircleOutline}
                    className={`${CLASSNAME}__play`}
                    color={theme === Theme.dark ? 'light' : 'dark'}
                    emphasis={Emphasis.low}
                    aria-controls={slideshowSlidesId}
                />
            ) : null}

            <IconButton
                {...nextButtonProps}
                icon={mdiChevronRight}
                className={`${CLASSNAME}__navigation`}
                color={theme === Theme.dark ? 'light' : 'dark'}
                emphasis={Emphasis.low}
                onClick={onNextClick}
                aria-controls={slideshowSlidesId}
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
