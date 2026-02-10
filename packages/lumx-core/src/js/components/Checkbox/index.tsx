import { mdiCheck, mdiMinus } from '@lumx/icons';

import type { JSXElement, LumxClassName, HasTheme, HasAriaDisabled, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';
import { InputLabel } from '../InputLabel';
import { InputHelper } from '../InputHelper';

/**
 * Intermediate state of checkbox.
 */
export const INTERMEDIATE_STATE = 'intermediate';

/**
 * Defines the props of the component.
 */
export interface CheckboxProps extends HasTheme, HasClassName, HasAriaDisabled {
    /** Helper text. */
    helper?: string;
    /** Native input id property. */
    id?: string;
    /** Whether it is checked or not or intermediate. */
    isChecked?: boolean | 'intermediate';
    checked?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label text. */
    label?: JSXElement;
    /** Native input name property. */
    name?: string;
    /** Native input value property. */
    value?: string;
    /** optional props for input */
    inputProps?: Record<string, any>;
    /** Native input ref. */
    inputRef?: CommonRef;
    /** Native input id. */
    inputId: string;
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: any): void;
    /** reference to the root element */
    ref?: CommonRef;
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
export const DEFAULT_PROPS: Partial<CheckboxProps> = {};

/**
 * Checkbox component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Checkbox = (props: CheckboxProps) => {
    const {
        checked,
        className,
        helper,
        id,
        inputRef,
        isChecked = checked,
        label,
        name,
        ref,
        onChange,
        theme,
        value,
        inputProps = {},
        isDisabled,
        inputId,
        ...forwardedProps
    } = props;

    const intermediateState = isChecked === INTERMEDIATE_STATE;

    const handleChange = (event: any) => {
        if (onChange) {
            onChange(!isChecked, value, name, event);
        }
    };

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
                    id={inputId}
                    className={element('input-native')}
                    name={name}
                    value={value}
                    checked={isChecked as boolean}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    aria-checked={intermediateState ? 'mixed' : Boolean(isChecked)}
                    {...(inputProps?.readOnly ? { readOnly: inputProps.readOnly } : {})}
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
                {label && InputLabel({ htmlFor: inputId, className: element('label'), theme, children: label })}
                {helper &&
                    InputHelper({ id: `${inputId}-helper`, className: element('helper'), theme, children: helper })}
            </div>
        </div>
    );
};
