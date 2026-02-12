import type {
    JSXElement,
    LumxClassName,
    HasTheme,
    HasAriaDisabled,
    HasDisabled,
    HasClassName,
    HasChecked,
    CommonRef,
} from '../../types';
import { classNames } from '../../utils';
import { InputLabel } from '../InputLabel';
import { InputHelper } from '../InputHelper';

/**
 * Defines the props of the component.
 */
export interface SwitchProps extends HasTheme, HasClassName, HasAriaDisabled, HasDisabled, HasChecked {
    /** Helper text. */
    helper?: string;
    /** Native input id property. */
    id?: string;
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
    /** Position of the switch relative to the label. */
    position?: 'left' | 'right';
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Switch';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-switch';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<SwitchProps> = {
    position: 'left',
};

/**
 * Switch component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Switch = (props: SwitchProps) => {
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
        position = DEFAULT_PROPS.position,
        ...forwardedProps
    } = props;

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
                    'is-checked': isChecked,
                    'is-disabled': isDisabled,
                    'is-unchecked': !isChecked,
                    [`position-${position}`]: Boolean(position),
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            <div className={element('input-wrapper')}>
                <input
                    ref={inputRef}
                    type="checkbox"
                    role="switch"
                    id={inputId}
                    className={element('input-native')}
                    name={name}
                    value={value}
                    checked={Boolean(isChecked)}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    aria-checked={Boolean(isChecked)}
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
