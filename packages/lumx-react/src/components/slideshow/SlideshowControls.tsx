import React, { forwardRef, RefObject, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import {
    EDGE_FROM_ACTIVE_INDEX,
    PAGINATION_ITEMS_MAX,
    PAGINATION_ITEM_SIZE,
} from '@lumx/react/components/slideshow/constants';
import { COMPONENT_PREFIX, LEFT_KEY_CODE, RIGHT_KEY_CODE } from '@lumx/react/constants';
import { Comp, GenericProps, detectSwipe, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import isFunction from 'lodash/isFunction';

/**
 * Defines the props of the component.
 */
export interface SlideshowControlsProps extends GenericProps {
    /** The index of the current slide. */
    activeIndex?: number;
    /** The props to pass to the next button, minus those already set by the SlideshowControls props. */
    nextButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** The reference of the parent element. */
    parentRef: RefObject<HTMLDivElement>;
    /** The props to pass to the previous button, minus those already set by the SlideshowControls props. */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** The number of slides. */
    slidesCount: number;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The function called on click on the "next" arrow */
    onNextClick?(): void;
    /** The function called on click on a navigation item */
    onPaginationClick?(index: number): void;
    /** The function called on click on the "previous" arrow */
    onPreviousClick?(): void;
}

/**
 * Defines the visible range of navigation items.
 */
export interface PaginationRange {
    minRange: number;
    maxRange: number;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SlideshowControls`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<SlideshowControlsProps> = {
    activeIndex: 0,
    theme: Theme.light,
};

/* eslint-disable react-hooks/rules-of-hooks,@typescript-eslint/no-use-before-define,jsx-a11y/control-has-associated-label,react-hooks/exhaustive-deps */
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
    if (typeof activeIndex === 'undefined' || typeof slidesCount === 'undefined') {
        return null;
    }
    const lastSlide = slidesCount - 1;

    /**
     * Handle keyboard shortcuts to navigate through slideshow.
     *
     * @param evt Keyboard event.
     */
    const handleKeyPressed = (evt: KeyboardEvent) => {
        const { keyCode } = evt;
        if (keyCode === LEFT_KEY_CODE) {
            handlePreviousClick();
        } else if (keyCode === RIGHT_KEY_CODE) {
            handleNextClick();
        }

        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Determines initial state of the visible range of pagination.
     *
     * @param index Index used to determinate position in slides.
     * @return Min and max for pagination position.
     */
    const initVisibleRange = (index: number): PaginationRange => {
        const deltaItems: number = PAGINATION_ITEMS_MAX - 1;
        let min: number = index - EDGE_FROM_ACTIVE_INDEX;
        let max: number = index + EDGE_FROM_ACTIVE_INDEX;

        if (index > lastSlide - EDGE_FROM_ACTIVE_INDEX) {
            min = lastSlide - deltaItems;
            max = lastSlide;
        } else if (index < deltaItems) {
            min = 0;
            max = deltaItems;
        }

        return { minRange: min, maxRange: max };
    };

    /**
     * Updates state of the visible range of pagination.
     *
     * @param index Index used to determinate position in slides.
     */
    const updateVisibleRange = (index: number) => {
        if (index === visibleRange.maxRange && index < lastSlide) {
            setVisibleRange(() => ({ minRange: visibleRange.minRange + 1, maxRange: visibleRange.maxRange + 1 }));
        } else if (index === visibleRange.minRange && index > 0) {
            setVisibleRange(() => ({ minRange: visibleRange.minRange - 1, maxRange: visibleRange.maxRange - 1 }));
        } else if (index < visibleRange.minRange || index > visibleRange.maxRange) {
            setVisibleRange(() => initVisibleRange(index));
        }
    };

    /**
     * Build an array of navigation items (bullets for example).
     *
     * @param lastIndex Index of last item.
     * @return Array of nabiagtion items.
     */
    const buildItemsArray = (lastIndex: number): JSX.Element[] => {
        const items: JSX.Element[] = [];

        for (let i = 0; i <= lastIndex; i++) {
            items.push(
                <button
                    className={classNames({
                        [`${CLASSNAME}__pagination-item`]: true,
                        [`${CLASSNAME}__pagination-item--is-active`]: activeIndex === i,
                        [`${CLASSNAME}__pagination-item--is-on-edge`]: isPaginationItemOnEdge(i),
                        [`${CLASSNAME}__pagination-item--is-out-range`]: isPaginationItemOutVisibleRange(i),
                    })}
                    key={i}
                    type="button"
                    onClick={() => handleItemClick(i)}
                    tabIndex={-1}
                />,
            );
        }

        return items;
    };

    /**
     * Handle click on an item to go to a specific slide.
     *
     * @param index Index of the slide to go to.
     */
    const handleItemClick = useCallback(
        (index: number) => {
            if (isFunction(onPaginationClick)) {
                onPaginationClick(index);
            }
        },
        [onPaginationClick],
    );

    /**
     * Handle click to go to next slide.
     */
    const handleNextClick = useCallback(() => {
        if (isFunction(onNextClick)) {
            onNextClick();
        }
    }, [onNextClick]);

    /**
     * Handle click to go to previous slide.
     */
    const handlePreviousClick = useCallback(() => {
        if (isFunction(onPreviousClick)) {
            onPreviousClick();
        }
    }, [onPreviousClick]);

    /**
     * Determine if a navigation item is visible.
     *
     * @param index Index of navigation item.
     * @return Whether navigation item is visble or not.
     */
    const isPaginationItemOutVisibleRange = (index: number): boolean => {
        return index < visibleRange.minRange || index > visibleRange.maxRange;
    };

    /**
     * Check if the pagination item is on edge, indicating other slides after or before.
     *
     * @param  index The index of the pagination item to check.
     * @return Whether the pagination item is on edge or not.
     */
    const isPaginationItemOnEdge = (index: number): boolean => {
        return (
            index !== 0 && index !== lastSlide && (index === visibleRange.minRange || index === visibleRange.maxRange)
        );
    };

    const [visibleRange, setVisibleRange]: [
        PaginationRange,
        React.Dispatch<React.SetStateAction<PaginationRange>>,
    ] = useState(initVisibleRange(activeIndex));
    const paginationItems: JSX.Element[] = buildItemsArray(lastSlide);

    useEffect(() => {
        updateVisibleRange(activeIndex);
    }, [activeIndex, updateVisibleRange]);

    /**
     * Inline style of wrapper element.
     */
    const wrapperStyle = {
        transform: `translateX(-${PAGINATION_ITEM_SIZE * visibleRange.minRange}px)`,
    };

    useEffect(() => {
        if (!parentRef?.current) {
            return undefined;
        }
        const { current } = parentRef;
        current.addEventListener('keydown', handleKeyPressed);

        const swipeListeners = detectSwipe(current, (swipeDirection: string) => {
            if (swipeDirection === 'right') {
                handlePreviousClick();
            }
            if (swipeDirection === 'left') {
                handleNextClick();
            }
        });

        return () => {
            current.removeEventListener('keydown', handleKeyPressed);
            swipeListeners();
        };
    }, [activeIndex, handleKeyPressed, handleNextClick, handlePreviousClick, parentRef]);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--has-infinite-pagination`]: slidesCount > PAGINATION_ITEMS_MAX,
            })}
        >
            <IconButton
                {...nextButtonProps}
                icon={mdiChevronLeft}
                className={`${CLASSNAME}__navigation`}
                color={theme === Theme.dark ? 'light' : 'dark'}
                emphasis={Emphasis.low}
                onClick={handlePreviousClick}
                tabIndex={-1}
            />
            <div className={`${CLASSNAME}__pagination`}>
                <div className={`${CLASSNAME}__pagination-items`} style={wrapperStyle}>
                    {paginationItems}
                </div>
            </div>
            <IconButton
                {...previousButtonProps}
                icon={mdiChevronRight}
                className={`${CLASSNAME}__navigation`}
                color={theme === Theme.dark ? 'light' : 'dark'}
                emphasis={Emphasis.low}
                onClick={handleNextClick}
                tabIndex={-1}
            />
        </div>
    );
});
SlideshowControls.displayName = COMPONENT_NAME;
SlideshowControls.className = CLASSNAME;
SlideshowControls.defaultProps = DEFAULT_PROPS;
