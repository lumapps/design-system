import { mdiClose } from '@lumx/icons';
import { Autocomplete, AutocompleteProps, Chip, ChipGroup, Icon, Size } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface AutocompleteMultipleProps extends AutocompleteProps {
    /**
     * The list of selected values.
     */
    values: any[];

    /**
     * How the chips are aligned on the autocomplete
     */
    chipsAlignment?: string;

    /**
     * This function will be executed to render the values that are already selected. By default, it will assume that
     * the values are strings, and will render them as such. If that is not the case, this function needs to be overrided
     * in order to reflect that.
     */
    selectedChipRender(
        choice: any,
        index: number,
        onClear?: (event: React.MouseEvent, choice: any) => void,
        isDisabled?: boolean,
    ): ReactNode | string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}AutocompleteMultiple`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<AutocompleteMultipleProps> = {
    closeOnClickAway: true,
    closeOnEscape: true,
    selectedChipRender(choice, index, onClear, isDisabled) {
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
    values: [],
};

export const AutocompleteMultiple: Comp<AutocompleteMultipleProps> = ({
    anchorToInput,
    children,
    chipsAlignment,
    className,
    closeOnClickAway,
    closeOnEscape,
    fitToAnchorWidth,
    hasError,
    helper,
    icon,
    inputRef,
    clearButtonProps,
    isDisabled,
    isOpen,
    isValid,
    label,
    name,
    offset,
    onBlur,
    onChange,
    onClear,
    onClose,
    onFocus,
    onInfiniteScroll,
    onKeyDown,
    placeholder,
    placement,
    selectedChipRender,
    shouldFocusOnClose,
    theme,
    type,
    value,
    values,
    ...forwardedProps
}) => (
    <Autocomplete
        {...forwardedProps}
        anchorToInput={anchorToInput}
        className={classNames(
            className,
            handleBasicClasses({
                prefix: CLASSNAME,
            }),
        )}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        shouldFocusOnClose={shouldFocusOnClose}
        onFocus={onFocus}
        hasError={hasError}
        helper={helper}
        icon={icon}
        inputRef={inputRef}
        chips={
            <ChipGroup align={chipsAlignment}>
                {values && values.map((chip, index) => selectedChipRender(chip, index, onClear))}
            </ChipGroup>
        }
        isDisabled={isDisabled}
        clearButtonProps={clearButtonProps}
        isValid={isValid}
        label={label}
        placeholder={placeholder}
        theme={theme}
        type={type}
        isOpen={isOpen}
        closeOnClick={false}
        closeOnClickAway={closeOnClickAway}
        closeOnEscape={closeOnEscape}
        onClose={onClose}
        offset={offset}
        placement={placement}
        fitToAnchorWidth={fitToAnchorWidth}
        onInfiniteScroll={onInfiniteScroll}
    >
        {children}
    </Autocomplete>
);
AutocompleteMultiple.displayName = COMPONENT_NAME;
AutocompleteMultiple.className = CLASSNAME;
AutocompleteMultiple.defaultProps = DEFAULT_PROPS;
