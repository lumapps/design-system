import React, { ReactNode, useState } from 'react';

import classNames from 'classnames';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMenuDown } from '@mdi/js';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Chip, Dropdown, Icon, List, ListItem, PopperPlacement, Size, Theme } from 'LumX';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * The authorized variants.
 */
const enum SelectVariant {
    input = 'input',
    chip = 'chip',
}

/**
 * Defines the props of the component.
 */
interface ISelectProps extends IGenericProps {
    /**
     * The list of choices.
     */
    choices: string[];

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
    variant?: SelectVariant;

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
    variant: SelectVariant.input,
};
/////////////////////////////

/**
 * Select component.
 *
 * @return The component.
 */
const Select: React.FC<SelectProps> = ({
    className = '',
    hasError = DEFAULT_PROPS.hasError,
    // tslint:disable-next-line: no-unused
    hasFilter = DEFAULT_PROPS.hasFilter,
    // tslint:disable-next-line: no-unused
    hasHelper = DEFAULT_PROPS.hasHelper,
    isClearable = DEFAULT_PROPS.isClearable,
    // tslint:disable-next-line: no-unused
    isLoading = DEFAULT_PROPS.isLoading,
    isValid = DEFAULT_PROPS.isValid,
    multiple = DEFAULT_PROPS.multiple,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    choices,
    // tslint:disable-next-line: no-unused
    helper,
    isDisabled,
    label,
    placeholder,
    // tslint:disable-next-line: no-unused
    filter,
    ...props
}: SelectProps): React.ReactElement => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // tslint:disable-next-line: no-unused
    const [isFocus, setIsFocus] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const isEmpty = selectedValues.length === 0;
    const targetUuid = 'uuid';

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const clearSelectedvalues = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value?: string): void => {
        event.stopPropagation();
        setSelectedValues(value ? selectedValues.filter((val: string) => val !== value) : []);
    };

    const createParentElement: () => ReactNode = (): ReactNode => {
        return (
            <>
                {variant === SelectVariant.input && (
                    <>
                        {label && <span className={`${CLASSNAME}__label`}>{label}</span>}

                        <div className={`${CLASSNAME}__input-wrapper`} id={targetUuid} tabIndex={0}>
                            {isEmpty && placeholder && (
                                <div
                                    className={classNames([
                                        `${CLASSNAME}__input-native`,
                                        `${CLASSNAME}__input-native--placeholder`,
                                    ])}
                                >
                                    <span>{placeholder}</span>
                                </div>
                            )}

                            {!isEmpty && !multiple && (
                                <div className={`${CLASSNAME}__input-native`}>
                                    <span>{selectedValues[0]}</span>
                                </div>
                            )}

                            <div className={`${CLASSNAME}__input-chips`}>
                                {!isEmpty && multiple && (
                                    <div className={`${CLASSNAME}__input-chip`}>
                                        {selectedValues.map((value: string, index: number) => (
                                            <Chip
                                                key={index}
                                                after={<Icon icon={mdiClose} size={Size.xxs} />}
                                                isDisabled={isDisabled}
                                                size={Size.s}
                                                // tslint:disable-next-line: jsx-no-lambda
                                                onAfterClick={(
                                                    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                                                ): void => clearSelectedvalues(event, value)}
                                                // tslint:disable-next-line: jsx-no-lambda
                                                onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void =>
                                                    clearSelectedvalues(event, value)
                                                }
                                            >
                                                {value}
                                            </Chip>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {(isValid || hasError) && (
                                <div className={`${CLASSNAME}__input-validity`}>
                                    <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xs} />
                                </div>
                            )}

                            {isClearable && !multiple && !isEmpty && (
                                <div className={`${CLASSNAME}__input-clear`} onClick={clearSelectedvalues}>
                                    <Icon icon={mdiCloseCircle} size={Size.xs} />
                                </div>
                            )}

                            <div className={`${CLASSNAME}__input-indicator`}>
                                <Icon icon={mdiMenuDown} size={Size.s} />
                            </div>
                        </div>
                    </>
                )}

                {variant === SelectVariant.chip && (
                    <Chip
                        id={targetUuid}
                        isSelected={!isEmpty}
                        after={<Icon icon={isEmpty ? mdiMenuDown : mdiCloseCircle} />}
                        // tslint:disable-next-line: jsx-no-lambda
                        onAfterClick={isEmpty ? toggleDropdown : clearSelectedvalues}
                        onClick={toggleDropdown}
                        theme={theme}
                    >
                        {isEmpty && <span>{label}</span>}

                        {!isEmpty && !multiple && <span>{selectedValues[0]}</span>}

                        {!isEmpty && multiple && (
                            <span>
                                <span>{selectedValues[0]}</span>

                                {selectedValues.length > 1 && <span>&nbsp;+{selectedValues.length - 1}</span>}
                            </span>
                        )}
                    </Chip>
                )}
            </>
        );
    };

    const createList: (setOpenStatus: (isOpen: boolean) => void) => ReactNode = (
        setOpenStatus: (isOpen: boolean) => void,
    ): ReactNode => {
        const onItemSelectedHandler: (item?: string) => void = (item?: string): void => {
            setOpenStatus(false);

            if (selectedValues.includes(item)) {
                return;
            }

            if (multiple) {
                setSelectedValues([...selectedValues, item]);
            } else {
                setSelectedValues([item]);
            }
        };

        return (
            <List isClickable={true}>
                {choices.length > 0
                    ? choices.map((choice: string, index: number) => (
                          // tslint:disable-next-line: jsx-no-lambda
                          <ListItem key={index} onItemSelected={(): void => onItemSelectedHandler(choice)}>
                              {choice}
                          </ListItem>
                      ))
                    : [<ListItem key={0}>No data</ListItem>]}
            </List>
        );
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    hasError,
                    hasLabel: Boolean(label),
                    hasMultiple: !isEmpty && multiple,
                    hasPlaceholder: Boolean(placeholder),
                    hasUnique: !isEmpty && !multiple,
                    hasValue: !isEmpty,
                    isDisabled,
                    isEmpty,
                    isFocus,
                    isOpen,
                    isValid,
                    prefix: CLASSNAME,
                    theme: theme === Theme.light ? Theme.light : Theme.dark,
                }),
            )}
            {...props}
        >
            <Dropdown
                closeOnClick={true}
                escapeClose={true}
                position={PopperPlacement.BOTTOM_START}
                showDropdown={isOpen}
                toggleElement={createParentElement()}
            >
                {(setOpenStatus: (isOpen: boolean) => void): ReactNode => createList(setOpenStatus)}
            </Dropdown>
        </div>
    );
};
Select.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Select, SelectProps, SelectVariant };
