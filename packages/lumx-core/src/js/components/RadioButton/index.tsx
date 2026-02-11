import type {
    JSXElement,
    LumxClassName,
    HasTheme,
    HasAriaDisabled,
    HasDisabled,
    HasClassName,
    CommonRef,
} from '../../types';
import { classNames } from '../../utils';
import { InputLabel } from '../InputLabel';
import { InputHelper } from '../InputHelper';

/**
 * Defines the props of the component.
 */
export interface RadioButtonProps extends HasTheme, HasClassName, HasAriaDisabled, HasDisabled {
    /** Helper text. */
    helper?: string;
    /** Native input id property. */
    id?: string;
    /** Whether it is checked or not. */
    isChecked?: boolean;
    /** @alias isChecked */
    checked?: boolean;
    /** Label content. */
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
    onChange?(value?: string, name?: string, event?: any): void;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'RadioButton';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-radio-button';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<RadioButtonProps> = {};

/**
 * RadioButton component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const RadioButton = (props: RadioButtonProps) => {
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

    const handleChange = (event: any) => {
        if (onChange) {
            onChange(value, name, event);
        }
    };

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    'is-checked': isChecked,
                    'is-disabled': isDisabled,
                    'is-unchecked': !isChecked,
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            <div className={element('input-wrapper')}>
                <input
                    ref={inputRef}
                    className={element('input-native')}
                    id={inputId}
                    type="radio"
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    {...(inputProps?.readOnly ? { readOnly: inputProps.readOnly } : {})}
                    {...inputProps}
                />

                <div className={element('input-placeholder')}>
                    <div className={element('input-background')} />
                    <div className={element('input-indicator')} />
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
