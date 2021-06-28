import React, { Ref, useCallback, useMemo, useRef } from 'react';

import classNames from 'classnames';
import { uid } from 'uid';

import { Kind, Theme } from '@lumx/react/components';
import { Dropdown } from '@lumx/react/components/dropdown/Dropdown';
import { InputHelper } from '@lumx/react/components/input-helper/InputHelper';
import { Placement } from '@lumx/react/components/popover/Popover';

import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useListenFocus } from '@lumx/react/hooks/useListenFocus';
import { CoreSelectProps, SelectVariant } from './constants';

/** The display name of the component. */
const COMPONENT_NAME = 'Select';

/** The default class name and classes prefix for this component. */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/** The default value of props. */
export const DEFAULT_PROPS: Partial<CoreSelectProps> = {
    theme: Theme.light,
    variant: SelectVariant.input,
};

export const WithSelectContext = (
    SelectElement: React.FC<any>,
    {
        children,
        className,
        isMultiple,
        closeOnClick = !isMultiple,
        disabled,
        error,
        hasError,
        helper,
        id,
        isDisabled = disabled,
        isEmpty,
        isOpen,
        isRequired,
        isValid,
        label,
        onClear,
        onDropdownClose,
        onInfiniteScroll,
        onInputClick,
        placeholder,
        theme = DEFAULT_PROPS.theme,
        value,
        variant = DEFAULT_PROPS.variant,
        ...forwardedProps
    }: CoreSelectProps,
    ref: Ref<HTMLDivElement>,
): React.ReactElement => {
    const selectId = useMemo(() => id || `select-${uid()}`, [id]);
    const anchorRef = useRef<HTMLElement>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const isFocus = useListenFocus(anchorRef);

    const handleKeyboardNav = useCallback(
        (evt: React.KeyboardEvent<HTMLElement>) => {
            if ((evt.key === 'Enter' || evt.key === ' ' || evt.key === 'ArrowDown') && onInputClick) {
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
        anchorRef?.current?.blur();
    };

    return (
        <div
            ref={mergeRefs(ref, selectRef)}
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
            )}
        >
            <SelectElement
                {...forwardedProps}
                anchorRef={anchorRef}
                aria-disabled={isDisabled}
                handleKeyboardNav={handleKeyboardNav}
                hasError={hasError}
                isDisabled={isDisabled}
                isEmpty={isEmpty}
                isRequired={isRequired}
                isValid={isValid}
                label={label}
                placeholder={placeholder}
                id={selectId}
                theme={theme}
                value={value}
                variant={variant}
                onClear={onClear}
                onInputClick={onInputClick}
            />
            <Dropdown
                anchorRef={anchorRef}
                closeOnClick={closeOnClick}
                closeOnClickAway
                closeOnEscape
                isOpen={!!isOpen}
                placement={Placement.BOTTOM_START}
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
