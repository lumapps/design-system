import React, { useState } from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v4';

import { Icon, Sizes, Theme, Themes } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { mdiAlertCircle, mdiCheckCircle } from 'LumX/icons';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITextFieldProps extends IGenericProps {
    /** Whether the text field is displayed with error style or not */
    hasError?: boolean;

    /** The text field helper message */
    helper?: string;

    /** Id that will be passed to input element */
    id?: string;

    /** The text field icon from the mdi svg path */
    icon?: string;

    /** Whether the text field is disabled or not */
    isDisabled?: boolean;

    /** Whether the text field is displayed with valid style or not */
    isValid?: boolean;

    /** The text field label displayed in a label tag. On label click, focus the input (generate UUID) */
    label?: string;

    /** The text field placeholder message */
    placeholder?: string;

    /** Theme */
    theme?: string;
}
type TextFieldProps = ITextFieldProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TextFieldProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}TextField`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {};
/////////////////////////////

/**
 * Text field
 *
 * @return {React.ReactElement} The component.
 */
const TextField: React.FC<TextFieldProps> = ({
    className = '',
    hasError,
    helper,
    id = uuid(),
    icon,
    isDisabled,
    isValid,
    label,
    placeholder,
    theme = Themes.light,
    ...props
}: TextFieldProps): React.ReactElement => {
    const [hasFocus, setHasFocus]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [hasValue, setHasValue]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    /**
     * Handle change event on input.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event Event of HTML Element
     */
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => setHasValue(Boolean(event.target.value));

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--has-error`]: !isValid && hasError,
                [`${CLASSNAME}--has-icon`]: icon,
                [`${CLASSNAME}--has-label`]: label,
                [`${CLASSNAME}--has-placeholder`]: placeholder,
                [`${CLASSNAME}--has-value`]: hasValue,
                [`${CLASSNAME}--is-disabled`]: isDisabled,
                [`${CLASSNAME}--is-focus`]: hasFocus,
                [`${CLASSNAME}--is-valid`]: isValid,
            })}
        >
            {label && (
                <label htmlFor={id} className={`${CLASSNAME}__label`}>
                    {label}
                </label>
            )}

            {helper && <span className={`${CLASSNAME}__helper`}>{helper}</span>}

            <div className={`${CLASSNAME}__input-wrapper`}>
                {icon && (
                    <Icon
                        className={`${CLASSNAME}__input-icon`}
                        color={theme === Themes.dark ? 'light' : undefined}
                        icon={icon}
                        size={Sizes.xs}
                    />
                )}

                <div className={`${CLASSNAME}__input-native`}>
                    <input
                        id={id}
                        disabled={isDisabled}
                        type="text"
                        placeholder={placeholder}
                        // tslint:disable-next-line: jsx-no-lambda
                        onFocus={(): void => setHasFocus(true)}
                        // tslint:disable-next-line: jsx-no-lambda
                        onBlur={(): void => setHasFocus(false)}
                        onChange={handleChange}
                        {...props}
                    />
                </div>

                {(isValid || hasError) && (
                    <Icon
                        className={'__input-validity"'}
                        color={theme === Themes.dark ? 'light' : undefined}
                        icon={isValid ? mdiCheckCircle : mdiAlertCircle}
                        size={Sizes.xs}
                    />
                )}
            </div>
        </div>
    );
};
TextField.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TextField, TextFieldProps, Theme, Themes };
