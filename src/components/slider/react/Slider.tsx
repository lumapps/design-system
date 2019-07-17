import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Theme } from 'LumX';
// import useEventCallback from 'LumX/core/react/hooks/useEventCallback';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ISliderProps extends IGenericProps {}
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
    theme: Theme.light,
};
/////////////////////////////
/*
const handleMouseDown = useEventCallback((event) => {
    if (onMouseDown) {
        onMouseDown(event);
    }

    if (disabled) {
        return;
    }

    event.preventDefault();
    const finger = trackFinger(event, touchId);
    const { newValue, activeIndex } = getFingerNewValue({ finger, values, source: valueDerived });
    focusThumb({ sliderRef, activeIndex, setActive });

    if (!isControlled) {
        setValueState(newValue);
    }
    if (onChange) {
        onChange(event, newValue);
    }

    document.body.addEventListener('mousemove', handleTouchMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseup', handleTouchEnd);
});*/

/**
 * Slider component.
 *
 * @return The component.
 */
const Slider: React.FC<SliderProps> = ({
    className = '',
    theme = DEFAULT_PROPS.theme,
    ...props
}: SliderProps): ReactElement => {
    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props}>
            <span className={`${CLASSNAME}__label`}>12</span>
            <div className={`${CLASSNAME}__container`}>
                <span className={`${CLASSNAME}__track`} />
                <span className={`${CLASSNAME}__active-track`} />
                <div className={`${CLASSNAME}__handle`} />
            </div>
            <div className={`${CLASSNAME}__label`}>30</div>
        </div>
    );
};
Slider.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Slider, SliderProps };
