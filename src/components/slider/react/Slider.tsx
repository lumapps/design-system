import React, { ReactElement, useRef, MutableRefObject, useState } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Theme } from 'LumX';
import useEventCallback from 'LumX/core/react/hooks/useEventCallback';
// import useEventCallback from 'LumX/core/react/hooks/useEventCallback';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ISliderProps extends IGenericProps {
    disabled?: boolean;
    max: number;
    min: number;
    precision?: number;
    steps?: number;
    onChange?: (value: any) => void;
    onMouseDown?: (event: any) => void;
}
type SliderProps = ISliderProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<SliderProps> {
    /**
     * The theme.
     */
    theme?: Theme;
}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Slider`;

/**
 * The default class name and classes prefix for this component.
 *
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    defaultValue: 0,
    precision: 0,
    theme: Theme.light,
};
/////////////////////////////

/**
 * Slider component.
 *
 * @return The component.
 */
const Slider: React.FC<SliderProps> = ({
    className = '',
    max,
    min,
    onMouseDown,
    onChange,
    steps,
    precision = DEFAULT_PROPS.precision,
    defaultValue = DEFAULT_PROPS.defaultValue,
    disabled,
    theme = DEFAULT_PROPS.theme,
    ...props
}: SliderProps): ReactElement => {
    const sliderRef = useRef(null);
    const [value, setValue] = useState(defaultValue);
    const avaibleSteps: number[] = [];

    if( steps ){
        avaibleSteps.push(min);
        for()
    }

    const getPercentValue = (event: any, slider: HTMLElement): number => {
        const { width, left } = slider.getBoundingClientRect();
        const percent = (event.pageX - left - window.pageXOffset) / width;
        return percent < 0 ? 0 : percent > 1 ? 1 : percent;
    };

    const computeNewValue = (percent: number): number => Number((min + percent * (max - min)).toFixed(precision));

    const handleTouchMove = useEventCallback((event) => {
        const { current: slider } = sliderRef;
        const newValue = getPercentValue(event, slider! as HTMLElement);

        if (onChange) {
            onChange(computeNewValue(newValue));
        }
        setValue(newValue);
    });

    const handleTouchEnd = useEventCallback((event) => {
        document.body.removeEventListener('mousemove', handleTouchMove);
        document.body.removeEventListener('mouseup', handleTouchEnd);
        document.body.removeEventListener('touchmove', handleTouchMove);
        document.body.removeEventListener('touchend', handleTouchEnd);
    });

    const handleMouseDown = useEventCallback((event) => {
        if (onMouseDown) {
            onMouseDown(event);
        }
        if (disabled) {
            return;
        }
        const { current: slider } = sliderRef;
        const newValue = getPercentValue(event, slider! as HTMLElement);
        if (onChange) {
            onChange(computeNewValue(newValue));
        }
        setValue(newValue);

        document.body.addEventListener('mousemove', handleTouchMove);
        document.body.addEventListener('mouseup', handleTouchEnd);
    });

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
            {...props}
            onMouseDown={handleMouseDown}
        >
            <span className={`${CLASSNAME}__label`}>{min}</span>
            <div className={`${CLASSNAME}__container`} ref={sliderRef}>
                <span className={`${CLASSNAME}__track`} />
                <span className={`${CLASSNAME}__active-track`} style={{ width: `${value * 100}%` }} />
                <div className={`${CLASSNAME}__handle`} style={{ left: `${value * 100}%` }} />
            </div>
            <div className={`${CLASSNAME}__label`}>{max}</div>
        </div>
    );
};
Slider.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Slider, SliderProps };
