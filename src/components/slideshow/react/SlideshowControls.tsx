import { Button } from 'LumX';
import { Theme, Themes } from 'LumX/components';
import { Emphasises } from 'LumX/components/button/react/Button';
import { Variants } from 'LumX/components/button/react/DropdownButton';
import { LEFT_KEY_CODE, PAGINATION_ITEMS_MAX, RIGHT_KEY_CODE } from 'LumX/components/slideshow/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { mdiChevronLeft, mdiChevronRight } from 'LumX/icons';
import classNames from 'classnames';
import React, { useEffect } from 'react';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ISlideshowControlsProps extends IGenericProps {
    activeIndex?: number;
    slidesCount?: number;
    theme?: Theme;
    onPaginationClick?(index: number): void;
    onNextClick?(): void;
    onPreviousClick?(): void;
}
type SlideshowControlsProps = ISlideshowControlsProps;

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
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}SlideshowControls`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    activeIndex: 0,
    slidesCount: 0,
    theme: Themes.light,
};

/////////////////////////////

/**
 * Controls for the slideshow component.
 *
 * @param {SlideshowControlsProps} {
 *     activeIndex = DEFAULT_PROPS.activeIndex,
 *     className = '',
 *     slidesCount = DEFAULT_PROPS.slidesCount,
 *     onPaginationClick = DEFAULT_PROPS.onPaginationClick,
 *     onNextClick = DEFAULT_PROPS.onNextClick,
 *     onPreviousClick = DEFAULT_PROPS.onPreviousClick,
 *     theme = DEFAULT_PROPS.theme,
 *     ...props
 * }
 * @return {(React.ReactElement | null)}
 */
const SlideshowControls: React.FC<SlideshowControlsProps> = ({
    // activeIndex = DEFAULT_PROPS.activeIndex,
    className = '',
    slidesCount = DEFAULT_PROPS.slidesCount,
    onPaginationClick = DEFAULT_PROPS.onPaginationClick,
    onNextClick = DEFAULT_PROPS.onNextClick,
    onPreviousClick = DEFAULT_PROPS.onPreviousClick,
    theme = DEFAULT_PROPS.theme,
    ...props
}: SlideshowControlsProps): React.ReactElement | null => {
    if (
        typeof onNextClick === 'undefined' ||
        typeof onPreviousClick === 'undefined' ||
        typeof onPaginationClick === 'undefined'
    ) {
        return null;
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPressed);

        return (): void => {
            document.removeEventListener('keydown', handleKeyPressed);
        };
    });

    /**
     * Handle keyboard shortcuts to navigate through slideshow.
     *
     * @param {KeyboardEvent} evt Keyboard event.
     */
    const handleKeyPressed: (evt: KeyboardEvent) => void = (evt: KeyboardEvent): void => {
        if (evt.keyCode === LEFT_KEY_CODE) {
            onPreviousClick();
        } else if (evt.keyCode === RIGHT_KEY_CODE) {
            onNextClick();
        }

        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Build an array of bullet elements.
     */
    // const buildBullets: () => void = useCallback(() => {
    //     // Nothing
    // }, []);

    /**
     * Handle click on a bullet to go to a specific slide.
     */
    // const handleBulletClick = useCallback((index: number) => {
    //     onPaginationClick(index);
    // }, []);

    const bullets: React.ReactNode = '';

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }), {
                [`${CLASSNAME}--has-infinite-pagination`]: slidesCount! > PAGINATION_ITEMS_MAX,
                [`${CLASSNAME}--theme-dark`]: theme === Themes.dark,
                [`${CLASSNAME}--theme-light`]: theme === Themes.light,
            })}
            {...props}
        >
            <Button
                leftIcon={mdiChevronLeft}
                className={`${CLASSNAME}__navigation`}
                color={theme === Themes.dark ? 'light' : 'dark'}
                emphasis={Emphasises.low}
                variant={Variants.icon}
                onClick={onPreviousClick}
                tabIndex="-1"
            />
            {bullets}
            {/* <div className={`${CLASSNAME}__pagination`}>
                    <div className={`${CLASSNAME}__pagination-items`}>
                        <Button
                            className={classNames({
                                [`${CLASSNAME}__pagination-item`}: true,
                                [`${CLASSNAME}__pagination-item--is-active`}: activeIndex === i,
                                [`${CLASSNAME}__pagination-item--is-on-edge`}: isPaginationItemOnEdge(i),
                                [`${CLASSNAME}__pagination-item--is-out-range`}: isPaginationItemOutVisibleRange(
                                    i,
                                ),
                            })}
                            onClick={() => handleBulletClick(i)}
                            tabindex="-1"
                        />
                    </div>
                </div> */}
            <Button
                leftIcon={mdiChevronRight}
                className={`${CLASSNAME}__navigation`}
                color={theme === Themes.dark ? 'light' : 'dark'}
                emphasis={Emphasises.low}
                variant={Variants.icon}
                onClick={onNextClick}
                tabIndex="-1"
            />
        </div>
    );
};
SlideshowControls.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, SlideshowControls, SlideshowControlsProps as SlideshowProps };
