import React, { RefObject, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import { Button } from 'LumX';
import { Theme, Themes } from 'LumX/components';
import { Emphasises } from 'LumX/components/button/react/Button';
import { Variants } from 'LumX/components/button/react/DropdownButton';
import {
    EDGE_FROM_ACTIVE_INDEX,
    PAGINATION_ITEMS_MAX,
    PAGINATION_ITEM_SIZE,
} from 'LumX/components/slideshow/constants';
import { LEFT_KEY_CODE, RIGHT_KEY_CODE } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { SwipeDirection, detectSwipe, handleBasicClasses } from 'LumX/core/utils';
import { mdiChevronLeft, mdiChevronRight } from 'LumX/icons';

import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ISlideshowControlsProps extends IGenericProps {
    activeIndex?: number;
    parentRef: RefObject<HTMLDivElement>;
    slidesCount: number;
    theme?: Theme;
    onPaginationClick?(index: number): void;
    onNextClick?(): void;
    onPreviousClick?(): void;
}
type SlideshowControlsProps = ISlideshowControlsProps;

/**
 * Defines the visible range of navigation items.
 */
interface IPaginationRange {
    minRange: number;
    maxRange: number;
}
type PaginationRange = IPaginationRange;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<SlideshowControlsProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    activeIndex: 0,
    onNextClick: noop,
    onPaginationClick: noop,
    onPreviousClick: noop,
    theme: Themes.light,
};

/////////////////////////////

/**
 * Controls for the slideshow component.
 */
const SlideshowControls: React.FC<SlideshowControlsProps> = ({
    /** Index of the current slide */
    activeIndex = DEFAULT_PROPS.activeIndex,
    /** Css class */
    className = '',
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
    ...props
}: SlideshowControlsProps): React.ReactElement | null => {
    if (typeof activeIndex === 'undefined' || typeof slidesCount === 'undefined') {
        return null;
    }

    /**
     * Handle keyboard shortcuts to navigate through slideshow.
     *
     * @param evt Keyboard event.
     */
    const handleKeyPressed: (evt: KeyboardEvent) => void = (evt: KeyboardEvent): void => {
        if (evt.keyCode === LEFT_KEY_CODE) {
            handlePreviousClick();
        } else if (evt.keyCode === RIGHT_KEY_CODE) {
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
    const initVisibleRange: (index: number) => PaginationRange = (index: number): PaginationRange => {
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
    const updateVisibleRange: (index: number) => void = (index: number): void => {
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
    const buildItemsArray: (lastIndex: number) => JSX.Element[] = (lastIndex: number): JSX.Element[] => {
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
                    onClick={(): void => handleItemClick(i)}
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
    const handleItemClick: (index: number) => void = useCallback(
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
    const handleNextClick: () => void = useCallback(() => {
        if (isFunction(onNextClick)) {
            onNextClick();
        }
    }, [onNextClick]);

    /**
     * Handle click to go to previous slide.
     */
    const handlePreviousClick: () => void = useCallback(() => {
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
    const isPaginationItemOutVisibleRange: (index: number) => boolean = (index: number): boolean => {
        return index < visibleRange.minRange || index > visibleRange.maxRange;
    };

    /**
     * Check if the pagination item is on edge, indicating other slides after or before.
     *
     * @param  index The index of the pagination item to check.
     * @return Whether the pagination item is on edge or not.
     */
    const isPaginationItemOnEdge: (index: number) => boolean = (index: number): boolean => {
        return (
            index !== 0 && index !== lastSlide && (index === visibleRange.minRange || index === visibleRange.maxRange)
        );
    };

    //////////////////////

    const [visibleRange, setVisibleRange]: [
        PaginationRange,
        React.Dispatch<React.SetStateAction<PaginationRange>>
    ] = useState(initVisibleRange(activeIndex));
    const lastSlide: number = slidesCount - 1;
    const paginationItems: JSX.Element[] = buildItemsArray(lastSlide);

    updateVisibleRange(activeIndex);

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

            swipeListeners = detectSwipe(
                parentRef.current,
                (swipeDirection: SwipeDirection): void => {
                    if (swipeDirection === 'right') {
                        handlePreviousClick();
                    }

                    if (swipeDirection === 'left') {
                        handleNextClick();
                    }
                },
            );
        }

        return (): void => {
            if (parentRef && parentRef.current) {
                parentRef.current.removeEventListener('keydown', handleKeyPressed);
                swipeListeners();
            }
        };
    }, [activeIndex, parentRef]);

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--has-infinite-pagination`]: slidesCount > PAGINATION_ITEMS_MAX,
            })}
            {...props}
        >
            <Button
                leftIcon={mdiChevronLeft}
                className={`${CLASSNAME}__navigation`}
                color={theme === Themes.dark ? 'light' : 'dark'}
                emphasis={Emphasises.low}
                variant={Variants.icon}
                onClick={handlePreviousClick}
                tabIndex={-1}
            />
            <div className={`${CLASSNAME}__pagination`}>
                <div className={`${CLASSNAME}__pagination-items`} style={wrapperStyle}>
                    {paginationItems}
                </div>
            </div>
            <Button
                leftIcon={mdiChevronRight}
                className={`${CLASSNAME}__navigation`}
                color={theme === Themes.dark ? 'light' : 'dark'}
                emphasis={Emphasises.low}
                variant={Variants.icon}
                onClick={handleNextClick}
                tabIndex={-1}
            />
        </div>
    );
};
SlideshowControls.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, SlideshowControls, SlideshowControlsProps as SlideshowProps };
