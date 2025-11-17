import React, { InputHTMLAttributes, ReactNode, SyntheticEvent } from 'react';

import classNames from 'classnames';

import { mdiCheck, mdiMinus } from '@lumx/icons';

import { Icon, InputHelper, InputLabel, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { useId } from '@lumx/react/hooks/useId';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { HasAriaDisabled } from '@lumx/react/utils/type/HasAriaDisabled';

/**
 * Intermediate state of checkbox.
 */
const INTERMEDIATE_STATE = 'intermediate';

/**
 * Defines the props of the component.
 */
export interface CheckboxProps extends GenericProps, HasTheme, HasAriaDisabled {
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
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
        theme = defaultTheme,
        value,
        inputProps = {},
        ...forwardedProps
    } = otherProps;
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
                    isDisabled: isAnyDisabled,
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
                    {...disabledStateProps}
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    aria-checked={intermediateState ? 'mixed' : Boolean(isChecked)}
                    readOnly={inputProps.readOnly || disabledStateProps['aria-disabled']}
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
