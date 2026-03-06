import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from '@lumx/icons';
import { HasTheme, HasAriaDisabled, HasClassName, JSXElement, CommonRef, GenericProps } from '../../types';
import { classNames } from '../../utils';

import { CLASSNAME } from './constants';
import { InputLabel, InputLabelProps } from '../InputLabel';
import { Emphasis, Kind, Size, Theme } from '../../constants';
import { Icon } from '../Icon';
import { InputHelper } from '../InputHelper';

const { block, element } = classNames.bem(CLASSNAME);

/**
 * Defines the props of the component.
 */
export interface TextFieldProps extends HasClassName, HasTheme, HasAriaDisabled {
    /** Chip Group to be rendered before the main text input. */
    chips?: JSXElement;
    /** Props to pass to the clear button (minus those already set by the TextField props). If not specified, the button won't be displayed. */
    clearButtonProps?: GenericProps;
    /** Error message. */
    error?: string | JSXElement;
    /** Whether we force the focus style or not. */
    forceFocusStyle?: boolean;
    /** Whether the text field is displayed with error style or not. */
    hasError?: boolean;
    /** Additional element to put at the end of the text field. */
    afterElement?: JSXElement;
    /** Helper text. */
    helper?: string | JSXElement;
    /** Icon (SVG path). */
    icon?: string;
    /** Native input id property (generated if not provided to link the label element). */
    id: string;
    /** Generated text field id for accessibility attributes. */
    helperId?: string;
    errorId?: string;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** Whether the text field is displayed with valid style or not. */
    isValid?: boolean;
    /** Label text. */
    label?: string;
    /** Additional label props. */
    labelProps?: InputLabelProps;
    /** Max string length the input accepts (constrains the input and displays a character counter). */
    maxLength?: number;
    /** Whether the text field is a textarea or an input. */
    multiline?: boolean;
    /** Placeholder text. */
    placeholder?: string;
    /** Reference to the wrapper. */
    textFieldRef?: CommonRef;
    /** Value. */
    value?: string;
    /** Whether any part is disabled. */
    isAnyDisabled?: boolean;
    /** The input element (input or textarea). */
    input: JSXElement;
    /** Whether the input is focused. */
    isFocus?: boolean;
    /** IconButton component. */
    IconButton: (props: Record<string, any>) => any;
    /** Ref to the component root. */
    ref?: CommonRef;
}

/**
 * Generate unique accessibility IDs for helper and error texts.
 * Combines them with any existing aria-describedby in priority order (error > helper > existing).
 *
 * @param helper Helper text content
 * @param error Error text content
 * @param generatedId Unique ID for this text field instance
 * @param existingAriaDescribedBy Existing aria-describedby value to merge
 * @return Object containing helperId, errorId, and combined describedById
 */
export function generateAccessibilityIds(
    helper: TextFieldProps['helper'],
    error: TextFieldProps['error'],
    generatedId: string,
    existingAriaDescribedBy?: string,
): { helperId?: string; errorId?: string; describedById?: string } {
    const helperId = helper ? `text-field-helper-${generatedId}` : undefined;
    const errorId = error ? `text-field-error-${generatedId}` : undefined;
    const describedByIds = [errorId, helperId, existingAriaDescribedBy].filter(Boolean);
    const describedById = describedByIds.length === 0 ? undefined : describedByIds.join(' ');

    return { helperId, errorId, describedById };
}

/**
 * TextField component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TextField = (props: TextFieldProps) => {
    const {
        chips,
        className,
        clearButtonProps,
        error,
        forceFocusStyle,
        hasError,
        helper,
        icon,
        id: textFieldId,
        isRequired,
        isValid,
        label,
        labelProps,
        isAnyDisabled,
        maxLength,
        multiline,
        placeholder,
        textFieldRef,
        helperId,
        errorId,
        theme,
        value,
        afterElement,
        input,
        isFocus,
        IconButton,
        ref,
    } = props;

    const valueLength = (value || '').length;
    const isNotEmpty = valueLength > 0;

    return (
        <div
            ref={ref}
            className={classNames.join(
                className,
                block({
                    'has-chips': Boolean(chips),
                    'has-error': !isValid && hasError,
                    'has-icon': Boolean(icon),
                    'has-input': !multiline,
                    'has-input-clear': Boolean(clearButtonProps && isNotEmpty),
                    'has-label': Boolean(label),
                    'has-placeholder': Boolean(placeholder),
                    'has-textarea': multiline,
                    'has-value': Boolean(value),
                    'is-disabled': isAnyDisabled,
                    'is-focus': isFocus || forceFocusStyle,
                    'is-valid': isValid,
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            {(label || maxLength) && (
                <div className={element('header')}>
                    {label &&
                        InputLabel({
                            ...labelProps,
                            htmlFor: textFieldId,
                            className: element('label'),
                            isRequired,
                            theme,
                            children: label,
                        })}

                    {maxLength && (
                        <div className={element('char-counter')}>
                            <span>{maxLength - valueLength}</span>
                            {maxLength - valueLength === 0 && Icon({ icon: mdiAlertCircle, size: Size.xxs })}
                        </div>
                    )}
                </div>
            )}

            <div className={element('wrapper')} ref={textFieldRef}>
                {icon &&
                    Icon({
                        className: element('input-icon'),
                        color: theme === Theme.dark ? 'light' : undefined,
                        icon,
                        size: Size.xs,
                    })}

                {chips ? (
                    <div className={element('chips')}>
                        {chips}

                        {input}
                    </div>
                ) : (
                    <div className={element('input-wrapper')}>{input}</div>
                )}

                {(isValid || hasError) &&
                    Icon({
                        className: element('input-validity'),
                        color: theme === Theme.dark ? 'light' : undefined,
                        icon: isValid ? mdiCheckCircle : mdiAlertCircle,
                        size: Size.xxs,
                    })}

                {clearButtonProps && isNotEmpty && !isAnyDisabled && (
                    <IconButton
                        {...clearButtonProps}
                        className={element('input-clear')}
                        icon={mdiCloseCircle}
                        emphasis={Emphasis.low}
                        size={Size.s}
                        theme={theme}
                        type="button"
                    />
                )}

                {afterElement && <div className={element('after-element')}>{afterElement}</div>}
            </div>

            {hasError &&
                error &&
                InputHelper({ children: error, className: element('helper'), kind: Kind.error, theme, id: errorId })}

            {helper && InputHelper({ className: element('helper'), theme, id: helperId, children: helper })}
        </div>
    );
};
