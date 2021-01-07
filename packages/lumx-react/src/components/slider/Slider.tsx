/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { forwardRef, SyntheticEvent, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { InputHelper, InputLabel, Theme } from '@lumx/react';

import useEventCallback from '@lumx/react/hooks/useEventCallback';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { uid } from 'uid';
import { clamp } from '@lumx/react/utils/clamp';

/**
 * Defines the props of the component.
 */
export interface SliderProps extends GenericProps {
    /** Helper text. */
    helper?: string;
    /** Whether the min and max labels should be hidden or not. */
    hideMinMaxLabel?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label text. */
    label?: string;
    /** Maximum value on the range. */
    max: number;
    /** Minimum value of the range. */
    min: number;
    /** Native input name property. */
    name?: string;
    /** Number of digits in the fractional part of the selected value. */
    precision?: number;
    /** Range step value. */
    steps?: number;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Selected ranged value. */
    value: number;
    /** On change callback. */
    onChange(value: number, name?: string, event?: SyntheticEvent): void;
    /** On click callback. */
    onMouseDown?(event: React.SyntheticEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Slider';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SliderProps> = {
    precision: 0,
    steps: 0,
    theme: Theme.light,
};

/**
 * Convert a percent value to a value in range min - max.
 *
 * @param percent   Value to convert.
 * @param min       Minimum value.
 * @param max       Maximum value.
 * @param precision Precision.
 * @return Value in range min - max
 */
const computeValueFromPercent = (percent: number, min: number, max: number, precision = 0): number =>
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
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Slider: Comp<SliderProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        className,
        disabled,
        helper,
        hideMinMaxLabel,
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
    } = props;
    const sliderId = useMemo(() => id || `slider-${uid()}`, [id]);
    const sliderLabelId = useMemo(() => `label-${sliderId}`, [sliderId]);
    const sliderRef = useRef<HTMLDivElement>(null);

    // build a lookup array for the steps.
    const availableSteps = useMemo((): number[] => {
        if (!steps) return [];

        const available = [0];
        const percentStep = 1 / ((max - min) / steps);
        let ptr = 0;
        while (ptr + percentStep < 1) {
            ptr += percentStep;
            available.push(ptr);
        }
        return available;
    }, [steps, min, max]);

    /**
     * Try to find the closest step to the current slider position.
     *
     * @param percentValue Reference value
     * @return The closest step value
     */
    const findClosestStep = (percentValue: number): number => {
        const closest = availableSteps.reduce(
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
        if (!slider || !onChange) return;
        const newValue = getPercentValue(event, slider);
        onChange(computeValueFromPercent(newValue, min, max, precision), name, event);
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
    const hopToValue = (previous = false) => {
        const oldPercent = computePercentFromValue(value, min, max);
        let percent = clamp(oldPercent + (previous ? -0.1 : 0.1), 0, 1);
        if (steps) {
            percent = oldPercent + availableSteps[1] * (previous ? -1 : 1);
            percent = findClosestStep(percent);
        }
        if (onChange) {
            onChange(computeValueFromPercent(percent, min, max, precision), name);
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
        onMouseDown?.(event);

        const { current: slider } = sliderRef;
        if (isDisabled || !slider) return;
        const newValue = getPercentValue(event, slider);
        if (onChange) {
            onChange(computeValueFromPercent(newValue, min, max, precision), name, event);
        }

        document.body.addEventListener('mousemove', handleMove);
        document.body.addEventListener('mouseup', handleEnd);
    });

    const percentString = `${computePercentFromValue(value, min, max) * 100}%`;
    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, theme, hasLabel: Boolean(label) }),
            )}
            onMouseDown={handleMouseDown}
            aria-disabled={isDisabled}
        >
            {label && (
                <InputLabel id={sliderLabelId} htmlFor={sliderId} className={`${CLASSNAME}__label`} theme={theme}>
                    {label}
                </InputLabel>
            )}

            {helper && (
                <InputHelper className={`${CLASSNAME}__helper`} theme={theme}>
                    {helper}
                </InputHelper>
            )}

            <div className={`${CLASSNAME}__ui-wrapper`}>
                {!hideMinMaxLabel && (
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
                            {availableSteps.map((step, idx) => (
                                <div
                                    key={`tick_${idx}`}
                                    className={`${CLASSNAME}__tick`}
                                    style={{ left: `${step * 100}%` }}
                                />
                            ))}
                        </div>
                    ) : null}
                    <button
                        type="button"
                        aria-labelledby={sliderLabelId}
                        name={name}
                        id={sliderId}
                        className={`${CLASSNAME}__handle`}
                        style={{ left: percentString }}
                        onKeyDown={handleKeyDown}
                        disabled={isDisabled}
                    />
                </div>
                {!hideMinMaxLabel && (
                    <span className={`${CLASSNAME}__value-label ${CLASSNAME}__value-label--max`}>{max}</span>
                )}
            </div>
        </div>
    );
});
Slider.displayName = COMPONENT_NAME;
Slider.className = CLASSNAME;
Slider.defaultProps = DEFAULT_PROPS;
