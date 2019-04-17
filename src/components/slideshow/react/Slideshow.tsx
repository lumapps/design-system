import { Theme, Themes } from 'LumX/components';
import { AUTOPLAY_DEFAULT_INTERVAL, FULL_WIDTH_PERCENT } from 'LumX/components/slideshow/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import { SlideshowControls } from './SlideshowControls';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ISlideshowProps extends IGenericProps {
    activeIndex?: number;
    autoPlay?: boolean;
    groupBy?: number;
    hasControls?: boolean;
    interval?: number;
    theme?: Theme;
}
type SlideshowProps = ISlideshowProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<SlideshowProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Slideshow`;

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
    autoPlay: false,
    groupBy: 1,
    hasControls: false,
    interval: AUTOPLAY_DEFAULT_INTERVAL,
    theme: Themes.light,
};

/////////////////////////////
//                         //
//      Custom hooks       //
//                         //
/////////////////////////////

/**
 * Making setInterval Declarative with React Hooks.
 * Credits: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param {() => void} callback Function called by setInterval.
 * @param {number}     delay    Delay for setInterval.
 */
function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback: React.MutableRefObject<(() => void) | undefined> = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect((): void | (() => void) => {
        function tick(): void {
            if (isFunction(savedCallback.current)) {
                savedCallback.current();
            }
        }

        if (delay !== null) {
            const id: NodeJS.Timeout = setInterval(tick, delay);

            return (): void => clearInterval(id);
        }
    }, [delay]);
}

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {SlideshowProps} props The children and props of the component.
 * @return {React.ReactNode}    The processed children of the component.
 */
function _validate(props: SlideshowProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        props,
    });
}

/////////////////////////////

/**
 * Displays a slideshow.
 *
 * @param {SlideshowProps} {
 *     activeIndex = DEFAULT_PROPS.activeIndex,
 *     autoPlay = DEFAULT_PROPS.autoPlay,
 *     children,
 *     className = '',
 *     groupBy = DEFAULT_PROPS.groupBy,
 *     hasControls = DEFAULT_PROPS.hasControls,
 *     interval = DEFAULT_PROPS.interval,
 *     theme = DEFAULT_PROPS.theme,
 *     ...props
 * }
 * @returns {(React.ReactElement | null)}
 */
const Slideshow: React.FC<SlideshowProps> = ({
    activeIndex = DEFAULT_PROPS.activeIndex,
    autoPlay = DEFAULT_PROPS.autoPlay,
    children,
    className = '',
    groupBy = DEFAULT_PROPS.groupBy,
    hasControls = DEFAULT_PROPS.hasControls,
    interval = DEFAULT_PROPS.interval,
    theme = DEFAULT_PROPS.theme,
    ...props
}: SlideshowProps): React.ReactElement | null => {
    if (typeof activeIndex === 'undefined' || typeof autoPlay === 'undefined' || typeof interval === 'undefined') {
        return null;
    }

    const newChildren: React.ReactNode = _validate({ children, ...props });
    const [currentIndex, setCurrentIndex]: [number, Dispatch<SetStateAction<number>>] = useState(activeIndex);
    const [isAutoPlaying, setIsAutoPlaying]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(autoPlay);

    /**
     * The number of slideshow items.
     *
     * @type {number}
     */
    const itemsCount: number = React.Children.count(newChildren);

    /**
     * Number of slides when using groupBy prop.
     */
    // const slidesCount: number = itemsCount / groupBy!;

    /**
     * Inline style of wrapper element.
     */
    const wrapperSyle: {} = {
        transform: `translateX(-${FULL_WIDTH_PERCENT * currentIndex}%)`,
    };

    /**
     * Start automatic rotation of slideshow.
     */
    useInterval(
        () => {
            nextSlide();
        },
        isAutoPlaying ? interval : null,
    );

    /**
     * Handle click on a bullet to go to a specific slide.
     */
    const handleControlGotToSlide: (index: number) => void = useCallback(
        (index: number) => {
            stopAutoPlay();

            if (currentIndex >= 0 && currentIndex < itemsCount) {
                setCurrentIndex(index);
            }
        },
        [currentIndex, isAutoPlaying, itemsCount, setCurrentIndex, setIsAutoPlaying],
    );

    /**
     * Handle click or keyboard event to go to next slide.
     */
    const handleControlNextSlide: () => void = (): void => {
        stopAutoPlay();
        nextSlide();
    };

    /**
     * Handle click or keyboard event to go to previous slide.
     */
    const handleControlPreviousSlide: () => void = (): void => {
        stopAutoPlay();
        previousSlide();
    };

    /**
     * Change current index to display next slide.
     */
    const nextSlide: () => void = useCallback(() => {
        if (currentIndex === itemsCount - 1) {
            setCurrentIndex(() => 0);
        } else if (currentIndex < itemsCount - 1) {
            setCurrentIndex((index: number): number => index + 1);
        }
    }, [currentIndex, itemsCount, setCurrentIndex]);

    /**
     * Change current index to display previous slide.
     */
    const previousSlide: () => void = useCallback(() => {
        if (currentIndex === 0) {
            setCurrentIndex(() => itemsCount - 1);
        } else if (currentIndex > 0) {
            setCurrentIndex((index: number): number => index - 1);
        }
    }, [currentIndex, itemsCount, setCurrentIndex]);

    /**
     * Stop slideshow auto rotating.
     */
    const stopAutoPlay: () => void = (): void => {
        if (isAutoPlaying) {
            setIsAutoPlaying((state: boolean) => !state);
        }
    };

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }), {
                [`${CLASSNAME}--group-by-${groupBy}`]: Boolean(groupBy),
                [`${CLASSNAME}--theme-${theme}`]: Boolean(theme),
            })}
            {...props}
            tabIndex={0}
        >
            <div className={`${CLASSNAME}__slides`}>
                <div className={`${CLASSNAME}__wrapper`} style={wrapperSyle}>
                    {newChildren}
                </div>
            </div>

            {hasControls && (
                <div className={`${CLASSNAME}__controls`}>
                    <SlideshowControls
                        activeIndex={currentIndex}
                        onPaginationClick={handleControlGotToSlide}
                        onNextClick={handleControlNextSlide}
                        onPreviousClick={handleControlPreviousSlide}
                        theme={theme}
                    />
                </div>
            )}
        </div>
    );
};
Slideshow.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Slideshow, SlideshowProps, Theme, Themes };
