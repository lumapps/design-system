import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { mdiCheck, mdiMinus } from '@lumx/icons';

import type { CommonRef, JSXElement, LumxClassName, GenericProps, HasTheme, HasAriaDisabled } from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';
import { InputLabel } from '../InputLabel';
import { InputHelper } from '../InputHelper';
import { FnRef } from '../../types/CommonRef';

/**
 * Intermediate state of checkbox.
 */
const INTERMEDIATE_STATE = 'intermediate';

/**
 * Defines the props of the component.
 */
export interface BaseCheckboxProps extends GenericProps, HasTheme, HasAriaDisabled {
    /** Helper text. */
    helper?: string;
    /** Native input id property. */
    id?: string;
    /** Native input ref. */
    inputRef: CommonRef<HTMLInputElement> | FnRef<HTMLInputElement>;
    /** Whether it is checked or not or intermediate. */
    isChecked?: boolean | 'intermediate';
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label text. */
    label?: JSXElement;
    /** Native input name property. */
    name?: string;
    /** Native input value property. */
    value?: string;
    /** optional props for input */
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: ChangeEvent | Event): void;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Checkbox';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-checkbox';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<BaseCheckboxProps> = {};

/**
 * Checkbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Checkbox = (props: BaseCheckboxProps) => {
    const {
        checked,
        className,
        helper,
        id,
        inputRef,
        isChecked = checked,
        label,
        name,
        onChange,
        ref,
        theme,
        value,
        isDisabled,
        inputProps = {},
        ...forwardedProps
    } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(!isChecked, value, name, event);
        }
    };

    const intermediateState = isChecked === INTERMEDIATE_STATE;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    // Whether state is intermediate class name will "-checked"
                    'is-checked': intermediateState ? true : isChecked,
                    'is-disabled': isDisabled,
                    'is-unchecked': !isChecked,
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            <div className={element('input-wrapper')}>
                <input
                    ref={inputRef}
                    type="checkbox"
                    id={inputProps.id}
                    className={element('input-native')}
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputProps.id}-helper` : undefined}
                    aria-checked={intermediateState ? 'mixed' : Boolean(isChecked)}
                    {...inputProps}
                />

                <div className={element('input-placeholder')}>
                    <div className={element('input-background')} />

                    <div className={element('input-indicator')}>
                        {Icon({ icon: intermediateState ? mdiMinus : mdiCheck })}
                    </div>
                </div>
            </div>

            <div className={element('content')}>
                {label &&
                    InputLabel({
                        htmlFor: inputProps.id as string,
                        className: element('label'),
                        theme,
                        children: label,
                    })}
                {helper &&
                    InputHelper({
                        id: `${inputProps.id}-helper`,
                        className: element('helper'),
                        theme,
                        children: helper,
                    })}
            </div>
        </div>
    );
};

Checkbox.displayName = COMPONENT_NAME;
Checkbox.className = CLASSNAME;
Checkbox.defaultProps = DEFAULT_PROPS;
