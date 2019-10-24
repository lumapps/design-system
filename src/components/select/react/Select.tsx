import React, { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMenuDown } from '@mdi/js';

import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Chip, Dropdown, Icon, Placement, Size, Theme } from 'LumX';

import { ENTER_KEY_CODE, SPACE_KEY_CODE } from 'LumX/core/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

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
interface ISelectProps extends IGenericProps {
    /**
     * The list of selected values.
     */
    value: string[];

    /**
     * Whether the select (input variant) is displayed with error style or not.
     */
    hasError?: boolean;

    /**
     * The helper to display within the popover (last position).
     */
    helper?: string;

    /**
     * Whether the select is disabled or not.
     */
    isDisabled?: boolean;

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
    onClear?(event: React.MouseEvent<HTMLDivElement, MouseEvent>, value?: string): void;

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
        onClear?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, choice: string) => void,
        isDisabled?: boolean,
    ): ReactNode | string;
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
    isMultiple: false,
    isOpen: false,
    isValid: false,
    selectedChipRender: (
        choice: string,
        index: number,
        onClear?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, choice: string) => void,
        isDisabled?: boolean,
    ): ReactNode | string => (
        <Chip
            key={index}
            after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
            isDisabled={isDisabled}
            size={Size.s}
            // tslint:disable-next-line: jsx-no-lambda
            onAfterClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void =>
                onClear && onClear(event, choice)
            }
            // tslint:disable-next-line: jsx-no-lambda
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => onClear && onClear(event, choice)}
        >
            {choice}
        </Chip>
    ),
    selectedValueRender: (choice: string): ReactNode | string => choice,
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
function useHandleElementFocus(element: HTMLElement | null, setIsFocus: (b: boolean) => void): void {
    useEffect((): VoidFunction | void => {
        if (!element) {
            return;
        }

        const setFocus = (): void => setIsFocus(true);
        const setBlur = (): void => setIsFocus(false);
        element.addEventListener('focus', setFocus);
        element.addEventListener('blur', setBlur);

        return (): void => {
            element.removeEventListener('focus', setFocus);
            element.removeEventListener('blur', setBlur);
        };
    }, [element]);
}

/**
 * Re-focus the element when the select is closed.
 *
 * @param element Element to focus.
 * @param isOpen  Whether or not the select is open.
 */
function useFocusOnClose(element: HTMLElement | null, isOpen: boolean | undefined): void {
    useEffect(() => {
        if (!isOpen && element) {
            // Re-focus the button when the select is closed.
            element.focus();
        }
    }, [isOpen]);
}

/**
 * Select component.
 *
 * @return The component.
 */
const Select: React.FC<SelectProps> = ({
    className = '',
    hasError = DEFAULT_PROPS.hasError,
    onClear,
    isValid = DEFAULT_PROPS.isValid,
    isMultiple = DEFAULT_PROPS.isMultiple,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    value = [],
    helper,
    isDisabled,
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
    const [isFocus, setIsFocus] = useState(false);
    const isEmpty = value.length === 0;
    const targetUuid = 'uuid';
    const anchorRef = useRef<HTMLElement>(null);

    useFocusOnClose(anchorRef.current, isOpen);
    useHandleElementFocus(anchorRef.current, setIsFocus);

    const handleKeyboardNav = (evt: React.KeyboardEvent<HTMLElement>): void => {
        if ((evt.which === ENTER_KEY_CODE || evt.which === SPACE_KEY_CODE) && onInputClick) {
            onInputClick();
        }
    };

    const createParentElement: () => ReactNode = (): ReactNode => {
        return (
            <>
                {variant === SelectVariant.input && (
                    <>
                        {label && <span className={`${CLASSNAME}__label`}>{label}</span>}
                        {helper && <span className={`${CLASSNAME}__helper`}>{helper}</span>}

                        <div
                            ref={anchorRef as RefObject<HTMLDivElement>}
                            id={targetUuid}
                            className={`${CLASSNAME}__wrapper`}
                            onClick={onInputClick}
                            onKeyPress={handleKeyboardNav}
                            tabIndex={0}
                        >
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

                            <div className={`${CLASSNAME}__input-chips`}>
                                {!isEmpty &&
                                    isMultiple &&
                                    value.map((val: string, index: number) => (
                                        <div key={index} className={`${CLASSNAME}__input-chip`}>
                                            {selectedChipRender!(val, index, onClear, isDisabled)}
                                        </div>
                                    ))}
                            </div>

                            {(isValid || hasError) && (
                                <div className={`${CLASSNAME}__input-validity`}>
                                    <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xs} />
                                </div>
                            )}

                            {onClear && !isMultiple && !isEmpty && (
                                <div className={`${CLASSNAME}__input-clear`} onClick={onClear}>
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
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    hasError,
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
                onClose={onDropdownClose}
                onInfiniteScroll={onInfiniteScroll}
            >
                {children}
            </Dropdown>
        </div>
    );
};
Select.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Select, SelectProps, SelectVariant };
