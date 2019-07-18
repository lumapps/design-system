import React, { ReactElement, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Theme } from 'LumX';
import useEventCallback from 'LumX/core/react/hooks/useEventCallback';

/////////////////////////////

/**
 * Defines the props of the component.
 */
// tslint:disable: no-any
interface ISliderProps extends IGenericProps {
    disabled?: boolean;
    max: number;
    min: number;
    precision?: number;
    steps?: number;
    hideMinMaxlabel?: boolean;
    onChange?(value: number): void;
    onMouseDown?(event: any): void;
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
    hideMinMaxlabel: false,
    precision: 0,
    theme: Theme.light,
};
/////////////////////////////

const clamp = (min: number, max: number, value: number): number => (value < min ? min : value > max ? max : value);

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
    hideMinMaxlabel = DEFAULT_PROPS.hideMinMaxlabel,
    disabled,
    theme = DEFAULT_PROPS.theme,
    ...props
}: SliderProps): ReactElement => {
    const sliderRef = useRef(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(0);
    const avaibleSteps: number[] = [];

    // build a lookup array for the steps.
    if (steps) {
        avaibleSteps.push(0);
        const percentStep = 1 / ((max - min) / steps);
        let ptr = 0;
        while (true) {
            if (ptr + percentStep < 1) {
                ptr += percentStep;
                avaibleSteps.push(ptr);
            } else {
                break;
            }
        }
        avaibleSteps.push(1);
    }

    /**
     * Try to find the closest step to the current slider position.
     *
     * @param percentValue Reference value
     * @return The closest step value
     */
    const findClosestStep = (percentValue: number): number => {
        const closest = avaibleSteps.reduce(
            // tslint:disable-next-line: typedef
            (acc, step) => {
                const aDst = Math.abs(percentValue - step);
                if (aDst < acc.dst) {
                    return { dst: aDst, val: step };
                }
                return acc;
            },
            { dst: Infinity, val: -1 },
        );
        return closest.val;
    };

    /**
     * Convert slider's handle position to percent.
     *
     * @param event The interaction event
     * @param slider the slider element
     * @return The computed percent value
     */
    const getPercentValue = (event: any, slider: HTMLElement): number => {
        const { width, left } = slider.getBoundingClientRect();
        let percent = (event.pageX - left - window.pageXOffset) / width;
        percent = clamp(0, 1, percent);
        if (steps) {
            percent = findClosestStep(percent);
        }
        return percent;
    };

    /**
     * Convert a percent value to a value in range min - max.
     *
     * @param percent The value to convert
     * @return Value in range min - max
     */
    const computeNewValue = (percent: number): number => Number((min + percent * (max - min)).toFixed(precision));

    /**
     * Register a handler for the mouse move event.
     */
    // tslint:disable-next-line: typedef
    const handleMove = useEventCallback((event) => {
        const { current: slider } = sliderRef;
        const newValue = getPercentValue(event, slider! as HTMLElement);

        if (onChange) {
            onChange(computeNewValue(newValue));
        }
        setValue(newValue);
    });

    /**
     * Register a handler for the mouse up event.
     * Clean a all listeners.
     */
    const handleEnd = useEventCallback(() => {
        document.body.removeEventListener('mousemove', handleMove);
        document.body.removeEventListener('mouseup', handleEnd);
        document.body.removeEventListener('touchmove', handleMove);
        document.body.removeEventListener('touchend', handleEnd);
    });

    /**
     * Register a handler for the mouseDown event.
     */
    // tslint:disable-next-line: typedef
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

        document.body.addEventListener('mousemove', handleMove);
        document.body.addEventListener('mouseup', handleEnd);
    });

    /**
     * Simple effect that set the default value to the slider.
     */
    useEffect(() => {
        const newValue = clamp(0, 1, (defaultValue - min) / (max - min));
        setValue(newValue);
        if (onChange) {
            onChange(computeNewValue(newValue));
        }
    }, []);

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
            {...props}
            onMouseDown={handleMouseDown}
        >
            {!hideMinMaxlabel && <span className={`${CLASSNAME}__label`}>{min}</span>}
            <div className={`${CLASSNAME}__container`} ref={sliderRef}>
                <span className={`${CLASSNAME}__track`} />
                <span className={`${CLASSNAME}__active-track`} style={{ width: `${value * 100}%` }} />
                {steps &&
                    avaibleSteps.map((step: number) => {
                        return <div className={`${CLASSNAME}__tick`} style={{ left: `${step * 100}%` }} />;
                    })}
                <div className={`${CLASSNAME}__handle`} style={{ left: `${value * 100}%` }} ref={handleRef} />
            </div>
            {!hideMinMaxlabel && <span className={`${CLASSNAME}__label`}>{max}</span>}
        </div>
    );
};
Slider.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Slider, SliderProps };
