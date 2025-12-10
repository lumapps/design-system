import { Ref, useCallback, useRef } from 'react';

import { Placement } from '@lumx/react';
import { Kind, Theme } from '@lumx/core/js/constants';
import { Dropdown } from '@lumx/react/components/dropdown/Dropdown';
import { InputHelper } from '@lumx/react/components/input-helper/InputHelper';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useListenFocus } from '@lumx/react/hooks/useListenFocus';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';

import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { CoreSelectProps } from './constants';

/** The display name of the component. */
const COMPONENT_NAME = 'Select';

/** The default class name and classes prefix for this component. */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-select';

export const WithSelectContext = (
    SelectElement: React.FC<any>,
    props: CoreSelectProps,
    ref: Ref<HTMLDivElement>,
): React.ReactElement => {
    const defaultTheme = useTheme() || Theme.light;
    const { block, element } = useClassnames(CLASSNAME);
    const {
        children,
        className,
        focusElement,
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
        theme = defaultTheme,
        value,
        variant,
        ...forwardedProps
    } = props;
    const generatedSelectId = useId();
    const selectId = id || generatedSelectId;
    const anchorRef = useRef<HTMLElement>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
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

    // Handle focus trap.
    useFocusTrap(isOpen && dropdownRef.current, focusElement?.current);

    return (
        <div
            ref={mergeRefs(ref, selectRef)}
            className={block(
                {
                    'has-error': hasError,
                    'has-label': Boolean(label),
                    'has-placeholder': Boolean(placeholder),
                    'has-value': !isEmpty,
                    'is-disabled': isDisabled,
                    'is-empty': isEmpty,
                    'is-focus': isFocus,
                    'is-open': isOpen,
                    'is-valid': isValid,
                    [`theme-${theme || Theme.light}`]: true,
                },
                className,
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
                ref={dropdownRef}
            >
                {children}
            </Dropdown>
            {hasError && error && (
                <InputHelper className={element('helper')} kind={Kind.error} theme={theme}>
                    {error}
                </InputHelper>
            )}
            {helper && (
                <InputHelper className={element('helper')} theme={theme}>
                    {helper}
                </InputHelper>
            )}
        </div>
    );
};
