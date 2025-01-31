import React, { InputHTMLAttributes, ReactNode, SyntheticEvent } from 'react';

import classNames from 'classnames';

import { mdiCheck, mdiMinus } from '@lumx/icons';

import { Icon, InputHelper, InputLabel, Theme } from '@lumx/react';
import type { GenericProps, HasTheme, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { useId } from '@lumx/react/hooks/useId';
import { useMergeRefs } from '@lumx/react/utils/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Intermediate state of checkbox.
 */
const INTERMEDIATE_STATE = 'intermediate';

/**
 * Defines the props of the component.
 */
export interface CheckboxProps extends GenericProps, HasTheme {
    /** Helper text. */
    helper?: string;
    /** Native input id property. */
    id?: string;
    /** Native input ref. */
    inputRef?: React.Ref<HTMLInputElement>;
    /** Whether it is checked or not or intermediate. */
    isChecked?: boolean | 'intermediate';
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label text. */
    label?: ReactNode;
    /** Native input name property. */
    name?: string;
    /** Native input value property. */
    value?: string;
    /** optional props for input */
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: SyntheticEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Checkbox';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-checkbox';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<CheckboxProps> = {};

/**
 * Checkbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Checkbox = forwardRef<CheckboxProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        checked,
        className,
        disabled,
        helper,
        id,
        inputRef,
        isChecked = checked,
        isDisabled = disabled,
        label,
        name,
        onChange,
        theme = defaultTheme,
        value,
        inputProps = {},
        ...forwardedProps
    } = props;
    const localInputRef = React.useRef<HTMLInputElement>(null);
    const generatedInputId = useId();
    const inputId = id || generatedInputId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(!isChecked, value, name, event);
        }
    };

    const intermediateState = isChecked === INTERMEDIATE_STATE;

    React.useEffect(() => {
        const input = localInputRef.current;
        if (input) input.indeterminate = intermediateState;
    }, [intermediateState]);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    // Whether state is intermediate class name will "-checked"
                    isChecked: intermediateState ? true : isChecked,
                    isDisabled,
                    isUnchecked: !isChecked,
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    ref={useMergeRefs(inputRef, localInputRef)}
                    type="checkbox"
                    id={inputId}
                    className={`${CLASSNAME}__input-native`}
                    disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    aria-checked={intermediateState ? 'mixed' : Boolean(isChecked)}
                    {...inputProps}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />

                    <div className={`${CLASSNAME}__input-indicator`}>
                        <Icon icon={intermediateState ? mdiMinus : mdiCheck} />
                    </div>
                </div>
            </div>

            <div className={`${CLASSNAME}__content`}>
                {label && (
                    <InputLabel htmlFor={inputId} className={`${CLASSNAME}__label`} theme={theme}>
                        {label}
                    </InputLabel>
                )}
                {helper && (
                    <InputHelper id={`${inputId}-helper`} className={`${CLASSNAME}__helper`} theme={theme}>
                        {helper}
                    </InputHelper>
                )}
            </div>
        </div>
    );
});
Checkbox.displayName = COMPONENT_NAME;
Checkbox.className = CLASSNAME;
Checkbox.defaultProps = DEFAULT_PROPS;
