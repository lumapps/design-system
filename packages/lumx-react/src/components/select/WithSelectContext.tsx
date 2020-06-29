import React, { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { Kind, Theme } from '@lumx/react/components';
import { Dropdown } from '@lumx/react/components/dropdown/Dropdown';
import { InputHelper } from '@lumx/react/components/input-helper/InputHelper';
import { Placement } from '@lumx/react/components/popover/Popover';

import { COMPONENT_PREFIX, CSS_PREFIX, DOWN_KEY_CODE, ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';

import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { CoreSelectProps, SelectVariant } from './constants';

/** Defines the props of the component. */
interface SelectProps extends CoreSelectProps {}

/** Define the types of the default props. */
interface DefaultPropsType extends Partial<SelectProps> {}

/** The display name of the component. */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Select`;

/** The default class name and classes prefix for this component. */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/** The default value of props. */
const DEFAULT_PROPS: DefaultPropsType = {
    hasError: false,
    isOpen: false,
    isValid: false,
    theme: Theme.light,
    variant: SelectVariant.input,
};

/**
 * Listen on element focus to store the focus status.
 *
 * @param element    Element to focus.
 * @param setIsFocus Setter used to store the focus status of the element.
 * @param isOpen Is the list opened
 * @param wasBlurred is it blurred
 * @param setWasBlurred set blurred
 * @param onBlur when its blurred
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

const withSelectContext = (
    SelectElement: any,
    {
        className,
        hasError = DEFAULT_PROPS.hasError,
        error,
        onClear,
        isValid = DEFAULT_PROPS.isValid,
        theme = DEFAULT_PROPS.theme,
        variant = DEFAULT_PROPS.variant,
        value,
        helper,
        isDisabled,
        isRequired,
        onBlur,
        isOpen = DEFAULT_PROPS.isOpen,
        onInputClick,
        onDropdownClose,
        label,
        placeholder,
        children,
        onInfiniteScroll,
        useCustomColors,
        isEmpty,
        ...forwardedProps
    }: SelectProps,
): React.ReactElement => {
    const targetUuid = 'uuid';
    const anchorRef = useRef<HTMLElement>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const [isFocus, setIsFocus] = useState(Boolean(isOpen));
    const [wasBlurred, setWasBlurred] = useState(false);

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

    return (
        <div
            ref={selectRef}
            className={classNames(
                className,
                handleBasicClasses({
                    hasError,
                    hasLabel: Boolean(label),
                    hasPlaceholder: Boolean(placeholder),
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
        >
            <SelectElement
                {...forwardedProps}
                variant={variant}
                label={label}
                value={value}
                isEmpty={isEmpty}
                isValid={isValid}
                hasError={hasError}
                onClear={onClear}
                onInputClick={onInputClick}
                theme={theme}
                placeholder={placeholder}
                handleKeyboardNav={handleKeyboardNav}
                targetUuid={targetUuid}
                anchorRef={anchorRef}
                isRequired={isRequired}
            />
            <Dropdown
                closeOnClickAway={true}
                closeOnEscape={true}
                placement={Placement.AUTO_START}
                isOpen={isOpen!}
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

export { DEFAULT_PROPS, withSelectContext };
