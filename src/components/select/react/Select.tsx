import React, { useState } from 'react';

import classNames from 'classnames';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMenuDown } from '@mdi/js';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Chip, Icon, Size, Theme } from 'LumX';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * The authorized variants.
 */
const enum Variants {
    input = 'input',
    chip = 'chip',
}
type Variant = Variants;

/**
 * Defines the props of the component.
 */
interface ISelectProps extends IGenericProps {
    /**
     * The list of choices.
     */
    // tslint:disable-next-line: no-any
    choices: any;

    /**
     * Whether the select (input variant) is displayed with error style or not.
     */
    hasError?: boolean;

    /**
     * Whether to display a search field in the popover or not.
     */
    hasFilter?: boolean;

    /**
     * Whether to display a helper within the popover (last position) or not.
     */
    hasHelper?: boolean;

    /**
     * The helper to display within the popover (last position).
     */
    helper?: string;

    /**
     * Whether to display a clear button in the select (input variant/unique mode) or not.
     */
    isClearable?: boolean;

    /**
     * Whether the select is disabled or not.
     */
    isDisabled?: boolean;

    /**
     * Whether to display a circular progress within the popover instead of the choices list or not.
     */
    isLoading?: boolean;

    /**
     * Whether the select (input variant) is displayed with valid style or not.
     */
    isValid?: boolean;

    /**
     * The select label.
     */
    label?: string;

    /**
     * Wether to let user select multiple values in the choices list or not.
     */
    multiple?: boolean;

    /**
     * The select placeholder (input variant).
     */
    placeholder?: string;

    /* The theme. */
    theme?: Theme;

    /**
     * The selected choices area style.
     */
    variant?: string;

    /**
     * The callback function called on integrated search field change (500ms debounce).
     */
    filter?(): void;
}
type SelectProps = ISelectProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<SelectProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Select`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    hasError: false,
    hasFilter: false,
    hasHelper: false,
    isClearable: false,
    isLoading: false,
    isValid: false,
    multiple: false,
    theme: Theme.light,
    variant: 'input',
};
/////////////////////////////

/**
 * Select component.
 *
 * @return The component.
 */
const Select: React.FC<SelectProps> = ({
    children,
    className = '',
    hasError = DEFAULT_PROPS.hasError,
    hasFilter = DEFAULT_PROPS.hasFilter,
    hasHelper = DEFAULT_PROPS.hasHelper,
    isClearable = DEFAULT_PROPS.isClearable,
    isLoading = DEFAULT_PROPS.isLoading,
    isValid = DEFAULT_PROPS.isValid,
    multiple = DEFAULT_PROPS.multiple,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    choices,
    helper,
    isDisabled,
    label,
    placeholder,
    filter,
    ...props
}: SelectProps): React.ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(null);
    const isEmpty = value === null;
    const viewValue = [];
    const targetUuid = 'uuid';

    const openDropdown = (): void => {
        setIsOpen(true);
    };

    const clearModel = (): void => {
        // Empty.
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    hasError,
                    hasLabel: label,
                    hasMultiple: !isEmpty && multiple,
                    hasPlaceholder: placeholder,
                    hasUnique: !isEmpty && !multiple,
                    hasValue: !isEmpty,
                    isDisabled,
                    isEmpty,
                    isFocus,
                    isOpen,
                    isValid,
                    multiple,
                    prefix: CLASSNAME,
                    themeDark: theme === Theme.dark,
                    themeLight: theme === Theme.light,
                    unique: !multiple,
                }),
            )}
            {...props}
        >
            {label && variant === Variants.input && <span className={`${CLASSNAME}__label`}>{label}</span>}

            {variant === Variants.input && (
                <div
                    className={`${CLASSNAME}__input-wrapper`}
                    id={targetUuid}
                    tabIndex={0}
                    onClick={openDropdown}
                    // Ng-focus="lumx.enableKeyEvents()".
                    // Ng-blur="lumx.disableKeyEvents()".
                >
                    {isEmpty && placeholder && (
                        <div className={`${CLASSNAME}__input-native lumx-select__input-native--placeholder`}>
                            <span>{placeholder}</span>
                        </div>
                    )}

                    {!isEmpty && !multiple && (
                        <div className={`${CLASSNAME}__input-native`}>
                            <span ng-bind-html="lumx.displaySelected()" />
                        </div>
                    )}

                    <div className={`${CLASSNAME}__input-chips`}>
                        {!isEmpty && multiple && (
                            <div className={`${CLASSNAME}__input-chip`} ng-repeat="selected in lumx.viewValue">
                                <Chip
                                    after={<Icon icon={mdiClose} size={Size.xxs} />}
                                    isDisabled={isDisabled}
                                    size={Size.s}
                                    onClick={}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(isValid || hasError) && (
                <div className={`${CLASSNAME}__input-validity`}>
                    <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xs} />
                </div>
            )}

            {isClearable && !multiple && !isEmpty && (
                <div className={`${CLASSNAME}__input-clear`} onClick={clearModel}>
                    <Icon icon={mdiCloseCircle} size={Size.xs} />
                </div>
            )}

            <div className={`${CLASSNAME}__input-indicator`}>
                <Icon icon={mdiMenuDown} size={Size.s} />
            </div>

            {/* {hasHelper && !isLoading && <span className={`${CLASSNAME}__helper`}>{helper}</span>} */}

            {variant === Variants.chip && (
                <Chip
                    id={targetUuid}
                    isSelected={!isEmpty}
                    after={<Icon icon={isEmpty ? mdiMenuDown : mdiCloseCircle} />}
                    LabelComponent="Rich"
                    onAfterClick={clearModel}
                    onClick={openDropdown}
                    theme={theme}
                >
                    {isEmpty && <span>{label}</span>}

                    {!isEmpty && !multiple && <span ng-bind-html="lumx.displaySelected()" />}

                    {!isEmpty && multiple && (
                        <span>
                            <span ng-bind-html="lumx.displaySelected(lumx.viewValue[0])" />

                            {viewValue.length > 1 && <span ng-if="viewValue.length > 1">+{viewValue.length - 1}</span>}
                        </span>
                    )}
                </Chip>
            )}

            {children}
        </div>
    );
};
Select.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Select, SelectProps, Variant as SelectVariant };
