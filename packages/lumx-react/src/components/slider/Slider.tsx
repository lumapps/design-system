import React, { SyntheticEvent, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { InputHelper, InputLabel, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import useEventCallback from '@lumx/react/hooks/useEventCallback';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import uuid from 'uuid/v4';

/**
 * Defines the props of the component.
 */
interface SliderProps extends GenericProps {
    /** Deactivate the component */
    isDisabled?: boolean;
    /** Label */
    label?: string;
    /** Helper message */
    helper?: string;
    /** Should the min and max labels be hidden */
    hideMinMaxlabel?: boolean;
    /** Maximum value */
    max: number;
    /** Minimum value */
    min: number;
    /**  Number of figures used for the fractional part of the value */
    precision?: number;
    /** Value between 2 steps */
    steps?: number;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Value */
    value: number;
    /** Native input name. */
    name?: string;
    /** Handle onChange event. */
    onChange(value: number, name?: string, event?: SyntheticEvent): void;
    /** Callback function invoked when the component is clicked */
    onMouseDown?(event: React.SyntheticEvent): void;
}

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
const DEFAULT_PROPS: Partial<SliderProps> = {
    precision: 0,
    steps: 0,
    theme: Theme.light,
};

/**
 * Clamp value in range.
 *
 * @param value Value to clamp.
 * @param min   Minimum value.
 * @param max   Maximum value.
 * @return Clamped value.
 */
const clamp = (value: number, min: number, max: number): number => (value < min ? min : value > max ? max : value);

/**
 * Convert a percent value to a value in range min - max.
 *
 * @param percent   Value to convert.
 * @param min       Minimum value.
 * @param max       Maximum value.
 * @param precision Precision.
 * @return Value in range min - max
 */
const computeValueFromPercent = (percent: number, min: number, max: number, precision: number): number =>
    Number((min + percent * (max - min)).toFixed(precision));

/**
 * Convert a value in range min - max to a percent value.
 *
 * @param value Value to convert.
 * @param min   Minimum value.
 * @param max   Maximum value.
 * @return Value in percent
 */
const computePercentFromValue = (value: number, min: number, max: number): number =>
    Number((value - min) / (max - min));

/**
 * Slider component.
 *
 * @return The component.
 */
const Slider: React.FC<SliderProps> = ({
    className,
    disabled,
    helper,
    hideMinMaxlabel,
    id,
    isDisabled = disabled,
    label,
    max,
    min,
    name,
    onChange,
    onMouseDown,
    precision,
    steps,
    theme,
    value,
    ...forwardedProps
}) => {
    const sliderId = useMemo(() => id || `slider-${uuid()}`, [id]);
    const sliderRef = useRef<HTMLDivElement>(null);
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
    const getPercentValue = (event: React.MouseEvent, slider: HTMLDivElement): number => {
        const { width, left } = slider.getBoundingClientRect();
        let percent = (event.pageX - left - window.pageXOffset) / width;
        percent = clamp(percent, 0, 1);
        if (steps) {
            percent = findClosestStep(percent);
        }
        return percent;
    };

    /**
     * Register a handler for the mouse move event.
     */
    const handleMove = useEventCallback((event: React.MouseEvent) => {
        const { current: slider } = sliderRef;
        const newValue = getPercentValue(event, slider!);

        if (onChange) {
            onChange(computeValueFromPercent(newValue, min, max, precision!), name, event);
        }
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
     * Move to the next or previous value (i.e. + or - 10%) or next step
     * @param previous Should seek the previous value.
     */
    const hopToValue = (previous: boolean = false) => {
        const oldPercent = computePercentFromValue(value, min, max);
        let percent = clamp(oldPercent + (previous ? -0.1 : 0.1), 0, 1);
        if (steps) {
            percent = oldPercent + avaibleSteps[1] * (previous ? -1 : 1);
            percent = findClosestStep(percent);
        }
        if (onChange) {
            onChange(computeValueFromPercent(percent, min, max, precision!), name);
        }
    };

    /**
     * Register a handler for keyboard interactions
     */
    const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
            hopToValue();
        } else if (event.key === 'ArrowLeft') {
            hopToValue(true);
        }
    });

    /**
     * Register a handler for the mouseDown event.
     */
    const handleMouseDown = useEventCallback((event: React.MouseEvent) => {
        if (onMouseDown) {
            onMouseDown(event);
        }
        if (isDisabled) {
            return;
        }
        const { current: slider } = sliderRef;
        const newValue = getPercentValue(event, slider!);
        if (onChange) {
            onChange(computeValueFromPercent(newValue, min, max, precision!), name, event);
        }

        document.body.addEventListener('mousemove', handleMove);
        document.body.addEventListener('mouseup', handleEnd);
    });

    const percentString = `${computePercentFromValue(value, min, max) * 100}%`;
    return (
        <div
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, theme, hasLabel: Boolean(label) }),
            )}
            onMouseDown={handleMouseDown}
            aria-disabled={isDisabled}
        >
            {label && (
                <InputLabel htmlFor={sliderId} className={`${CLASSNAME}__label`} theme={theme}>
                    {label}
                </InputLabel>
            )}

            {helper && (
                <InputHelper className={`${CLASSNAME}__helper`} theme={theme}>
                    {helper}
                </InputHelper>
            )}

            <div className={`${CLASSNAME}__ui-wrapper`}>
                {!hideMinMaxlabel && (
                    <span className={`${CLASSNAME}__value-label ${CLASSNAME}__value-label--min`}>{min}</span>
                )}
                <div className={`${CLASSNAME}__wrapper`} ref={sliderRef}>
                    <div className={`${CLASSNAME}__track ${CLASSNAME}__track--background`} />
                    <div
                        className={`${CLASSNAME}__track ${CLASSNAME}__track--active`}
                        style={{ width: percentString }}
                    />
                    {steps ? (
                        <div className={`${CLASSNAME}__ticks`}>
                            {avaibleSteps.map((step: number, idx: number) => {
                                return (
                                    <div
                                        key={`tick_${idx}`}
                                        className={`${CLASSNAME}__tick`}
                                        style={{ left: `${step * 100}%` }}
                                    />
                                );
                            })}
                        </div>
                    ) : null}
                    <button
                        name={name}
                        id={sliderId}
                        className={`${CLASSNAME}__handle`}
                        style={{ left: percentString }}
                        onKeyDown={handleKeyDown}
                        disabled={isDisabled}
                    />
                </div>
                {!hideMinMaxlabel && (
                    <span className={`${CLASSNAME}__value-label ${CLASSNAME}__value-label--max`}>{max}</span>
                )}
            </div>
        </div>
    );
};
Slider.displayName = COMPONENT_NAME;
Slider.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Slider, SliderProps };
