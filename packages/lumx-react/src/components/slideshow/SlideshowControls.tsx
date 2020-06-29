import React, { RefObject, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { Emphasis, IconButton, Theme } from '@lumx/react';
import {
    EDGE_FROM_ACTIVE_INDEX,
    PAGINATION_ITEMS_MAX,
    PAGINATION_ITEM_SIZE,
} from '@lumx/react/components/slideshow/constants';
import { COMPONENT_PREFIX, LEFT_KEY_CODE, RIGHT_KEY_CODE } from '@lumx/react/constants';
import { GenericProps, detectSwipe, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

/**
 * Defines the props of the component.
 */
interface SlideshowControlsProps extends GenericProps {
    activeIndex?: number;
    parentRef: RefObject<HTMLDivElement>;
    slidesCount: number;
    theme?: Theme;
    onPaginationClick?(index: number): void;
    onNextClick?(): void;
    onPreviousClick?(): void;
}

/**
 * Defines the visible range of navigation items.
 */
interface PaginationRange {
    minRange: number;
    maxRange: number;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<SlideshowControlsProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SlideshowControls`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    activeIndex: 0,
    onNextClick: noop,
    onPaginationClick: noop,
    onPreviousClick: noop,
    theme: Theme.light,
};

/**
 * Controls for the slideshow component.
 *
 * @param  props The component props.
 * @return The component.
 */
const SlideshowControls: React.FC<SlideshowControlsProps> = ({
    /** Index of the current slide */
    activeIndex = DEFAULT_PROPS.activeIndex,
    /** Css class */
    className,
    /** Reference of parent element */
    parentRef,
    /** Number of slides */
    slidesCount,
    /** Callback for the click on a navigation item */
    onPaginationClick = DEFAULT_PROPS.onPaginationClick,
    /** Callback for the click on the "next" arrow */
    onNextClick = DEFAULT_PROPS.onNextClick,
    /** Callback for the click on the "previous" arrow */
    onPreviousClick = DEFAULT_PROPS.onPreviousClick,
    /** Theme */
    theme = DEFAULT_PROPS.theme,
    ...forwardedProps
}) => {
    if (typeof activeIndex === 'undefined' || typeof slidesCount === 'undefined') {
        return null;
    }

    /**
     * Handle keyboard shortcuts to navigate through slideshow.
     *
     * @param evt Keyboard event.
     */
    const handleKeyPressed = (evt: KeyboardEvent) => {
        // tslint:disable-next-line: deprecation
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
                    // tslint:disable-next-line: jsx-no-lambda
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
    const lastSlide: number = slidesCount - 1;
    const paginationItems: JSX.Element[] = buildItemsArray(lastSlide);

    useEffect(() => {
        updateVisibleRange(activeIndex);
    }, [activeIndex]);

    /**
     * Inline style of wrapper element.
     */
    const wrapperStyle: {} = {
        transform: `translateX(-${PAGINATION_ITEM_SIZE * visibleRange.minRange}px)`,
    };

    useEffect(() => {
        let swipeListeners: () => void;

        if (parentRef && parentRef.current) {
            parentRef.current.addEventListener('keydown', handleKeyPressed);

            swipeListeners = detectSwipe(parentRef.current, (swipeDirection: string) => {
                if (swipeDirection === 'right') {
                    handlePreviousClick();
                }

                if (swipeDirection === 'left') {
                    handleNextClick();
                }
            });
        }

        return () => {
            if (parentRef && parentRef.current) {
                parentRef.current.removeEventListener('keydown', handleKeyPressed);
                swipeListeners();
            }
        };
    }, [activeIndex, parentRef]);

    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--has-infinite-pagination`]: slidesCount > PAGINATION_ITEMS_MAX,
            })}
        >
            <IconButton
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
                icon={mdiChevronRight}
                className={`${CLASSNAME}__navigation`}
                color={theme === Theme.dark ? 'light' : 'dark'}
                emphasis={Emphasis.low}
                onClick={handleNextClick}
                tabIndex={-1}
            />
        </div>
    );
};
SlideshowControls.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, SlideshowControls, SlideshowControlsProps as SlideshowProps };
