import React, { ReactNode, RefObject, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMenuDown } from '@lumx/icons';

import { Emphasis, Kind, Size, Theme } from '@lumx/react/components';
import { IconButton } from '@lumx/react/components/button/IconButton';
import { Chip } from '@lumx/react/components/chip/Chip';
import { ChipGroup } from '@lumx/react/components/chip/ChipGroup';
import { Dropdown } from '@lumx/react/components/dropdown/Dropdown';
import { Icon } from '@lumx/react/components/icon/Icon';
import { InputHelper } from '@lumx/react/components/input-helper/InputHelper';
import { InputLabel } from '@lumx/react/components/input-label/InputLabel';
import { Placement } from '@lumx/react/components/popover/Popover';

import { COMPONENT_PREFIX, CSS_PREFIX, DOWN_KEY_CODE, ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * The authorized variants.
 */
enum SelectVariant {
    input = 'input',
    chip = 'chip',
}

/**
 * Defines the props of the component.
 */
interface SelectProps extends GenericProps {
    /**
     * The list of selected values.
     */
    value: string[];

    /**
     * Whether the select (input variant) is displayed with error style or not.
     */
    hasError?: boolean;

    /** The error related to the component */
    error?: string | ReactNode;

    /**
     * The helper to display within the popover (last position).
     */
    helper?: string;

    /**
     * Whether the select is disabled or not.
     */
    isDisabled?: boolean;

    /**
     * Whether the select is required or not.
     */
    isRequired?: boolean;

    /**
     * Whether the select is opened or not.
     */
    isOpen?: boolean;

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
    isMultiple?: boolean;

    /**
     * The select placeholder (input variant).
     */
    placeholder?: string;

    /* The theme. */
    theme?: Theme;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;

    /**
     * The selected choices area style.
     */
    variant?: SelectVariant;

    /**
     * The callback function called when the clear button is clicked. NB: if not specified, clear buttons won't be displayed.
     */
    onClear?(event: SyntheticEvent, value?: string): void;

    /**
     * The callback function called when the select field is blurred
     */
    onBlur?(): void;

    /**
     * The callback function called on integrated search field change (500ms debounce).
     */
    onFilter?(): void;

    /**
     * The callback function called when the select input is clicked, can be used for dropdown toggle.
     */
    onInputClick?(): void;

    /**
     * The callback function called when the dropdown is closed.
     */
    onDropdownClose?(): void;

    /**
     * The callback function called when the bottom of the dropdown is reached.
     */
    onInfiniteScroll?(): void;

    /**
     * The function called to render the selected value. Default: Renders the value as a string.
     */
    selectedValueRender?(choice: string): ReactNode | string;

    /**
     * The function called to render a selected value when `isMultiple` is true. Default: Renders the value inside of a Chip
     */
    selectedChipRender?(
        choice: string,
        index: number,
        onClear?: (event: SyntheticEvent, choice: string) => void,
        isDisabled?: boolean,
    ): ReactNode | string;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<SelectProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    hasError: false,
    isMultiple: false,
    isOpen: false,
    isValid: false,
    selectedChipRender(choice, index, onClear, isDisabled?) {
        const onClick = (event: React.MouseEvent) => onClear && onClear(event, choice);
        return (
            <Chip
                key={index}
                after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
                isDisabled={isDisabled}
                size={Size.s}
                onAfterClick={onClick}
                onClick={onClick}
            >
                {choice}
            </Chip>
        );
    },
    selectedValueRender: (choice) => choice,
    theme: Theme.light,
    variant: SelectVariant.input,
};
/////////////////////////////

/**
 * Listen on element focus to store the focus status.
 *
 * @param element    Element to focus.
 * @param setIsFocus Setter used to store the focus status of the element.
 */
function useHandleElementFocus(
    element: HTMLElement | null,
    setIsFocus: (b: boolean) => void,
    isOpen: boolean,
    wasBlurred: boolean,
    setWasBlurred: (b: boolean) => void,
    onBlur?: () => void,
) {
    useEffect((): VoidFunction | void => {
        if (!element) {
            return undefined;
        }

        const setFocus = () => {
            if (!isOpen) {
                setIsFocus(true);
            }
        };

        const setBlur = () => {
            if (!isOpen) {
                setIsFocus(false);

                if (onBlur) {
                    onBlur();
                }
            }

            setWasBlurred(true);
        };

        element.addEventListener('focus', setFocus);
        element.addEventListener('blur', setBlur);

        return () => {
            element.removeEventListener('focus', setFocus);
            element.removeEventListener('blur', setBlur);
        };
    }, [element, isOpen, onBlur, wasBlurred]);
}

const stopPropagation = (evt: Event) => evt.stopPropagation();

/**
 * Select component.
 *
 * @return The component.
 */
const Select: React.FC<SelectProps> = ({
    className = '',
    hasError = DEFAULT_PROPS.hasError,
    error,
    onClear,
    isValid = DEFAULT_PROPS.isValid,
    isMultiple = DEFAULT_PROPS.isMultiple,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    value = [],
    helper,
    isDisabled,
    isRequired,
    onBlur,
    isOpen = DEFAULT_PROPS.isOpen,
    onInputClick,
    onDropdownClose,
    label,
    placeholder,
    selectedValueRender = DEFAULT_PROPS.selectedValueRender,
    selectedChipRender = DEFAULT_PROPS.selectedChipRender,
    children,
    onInfiniteScroll,
    useCustomColors,
    ...props
}: SelectProps): React.ReactElement => {
    const isEmpty = value.length === 0;
    const targetUuid = 'uuid';
    const anchorRef = useRef<HTMLElement>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const [isFocus, setIsFocus] = useState(Boolean(isOpen));
    const [wasBlurred, setWasBlurred] = useState(false);
    const hasInputClear = onClear && !isMultiple && !isEmpty;

    useHandleElementFocus(anchorRef.current, setIsFocus, Boolean(isOpen), wasBlurred, setWasBlurred, onBlur);

    const handleKeyboardNav = useCallback(
        (evt: React.KeyboardEvent<HTMLElement>) => {
            if (
                (evt.which === ENTER_KEY_CODE || evt.which === SPACE_KEY_CODE || evt.which === DOWN_KEY_CODE) &&
                onInputClick
            ) {
                evt.preventDefault();
                onInputClick();
            }
        },
        [onInputClick],
    );

    const onClose = () => {
        if (onDropdownClose) {
            onDropdownClose();
        }

        setWasBlurred(false);
        anchorRef?.current?.blur();
    };

    const createParentElement = useCallback((): ReactNode => {
        return (
            <>
                {variant === SelectVariant.input && (
                    <>
                        {label && (
                            <div className={`${CLASSNAME}__header`}>
                                <InputLabel
                                    htmlFor={targetUuid}
                                    className={`${CLASSNAME}__label`}
                                    isRequired={isRequired}
                                    theme={theme}
                                >
                                    {label}
                                </InputLabel>
                            </div>
                        )}

                        <div
                            ref={anchorRef as RefObject<HTMLDivElement>}
                            id={targetUuid}
                            className={`${CLASSNAME}__wrapper`}
                            onClick={onInputClick}
                            onKeyDown={handleKeyboardNav}
                            tabIndex={0}
                        >
                            <div className={`${CLASSNAME}__chips`}>
                                {!isEmpty && isMultiple && (
                                    <ChipGroup>
                                        {value.map((val: string, index: number) =>
                                            selectedChipRender!(val, index, onClear, isDisabled),
                                        )}
                                    </ChipGroup>
                                )}
                            </div>

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

                            {!isEmpty && !isMultiple && (
                                <div className={`${CLASSNAME}__input-native`}>
                                    <span>{selectedValueRender!(value[0])}</span>
                                </div>
                            )}

                            {(isValid || hasError) && (
                                <div className={`${CLASSNAME}__input-validity`}>
                                    <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xxs} />
                                </div>
                            )}

                            {hasInputClear && (
                                <IconButton
                                    className={`${CLASSNAME}__input-clear`}
                                    icon={mdiCloseCircle}
                                    emphasis={Emphasis.low}
                                    size={Size.s}
                                    theme={theme}
                                    onClick={onClear}
                                    onKeyDown={stopPropagation}
                                />
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
                        onAfterClick={isEmpty ? onInputClick : onClear}
                        onClick={onInputClick}
                        chipRef={anchorRef as RefObject<HTMLAnchorElement>}
                        theme={theme}
                    >
                        {isEmpty && <span>{label}</span>}

                        {!isEmpty && !isMultiple && <span>{selectedValueRender!(value[0])}</span>}

                        {!isEmpty && isMultiple && (
                            <span>
                                <span>{selectedValueRender!(value[0])}</span>

                                {value.length > 1 && <span>&nbsp;+{value.length - 1}</span>}
                            </span>
                        )}
                    </Chip>
                )}
            </>
        );
    }, [
        variant,
        label,
        value,
        isEmpty,
        isMultiple,
        isValid,
        hasError,
        onClear,
        onInputClick,
        theme,
        placeholder,
        handleKeyboardNav,
        targetUuid,
        anchorRef,
    ]);

    return (
        <div
            ref={selectRef}
            className={classNames(
                className,
                handleBasicClasses({
                    hasError,
                    hasInputClear,
                    hasLabel: Boolean(label),
                    hasMultiple: !isEmpty && isMultiple,
                    hasPlaceholder: Boolean(placeholder),
                    hasUnique: !isEmpty && !isMultiple,
                    hasValue: !isEmpty,
                    isDisabled,
                    isEmpty,
                    isFocus,
                    isOpen,
                    isValid,
                    prefix: CLASSNAME,
                    theme: theme === Theme.light ? Theme.light : Theme.dark,
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
            {...props}
        >
            {createParentElement()}
            <Dropdown
                closeOnClick={true}
                closeOnEscape={true}
                placement={Placement.AUTO_START}
                showDropdown={isOpen!}
                anchorRef={anchorRef}
                onClose={onClose}
                onInfiniteScroll={onInfiniteScroll}
            >
                {children}
            </Dropdown>
            {hasError && error && (
                <InputHelper className={`${CLASSNAME}__helper`} kind={Kind.error} theme={theme}>
                    {error}
                </InputHelper>
            )}
            {helper && (
                <InputHelper className={`${CLASSNAME}__helper`} theme={theme}>
                    {helper}
                </InputHelper>
            )}
        </div>
    );
};
Select.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Select, SelectProps, SelectVariant };
