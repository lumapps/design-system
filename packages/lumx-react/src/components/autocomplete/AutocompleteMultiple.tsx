import { mdiClose } from '@lumx/icons';
import { Autocomplete, AutocompleteProps, Chip, ChipGroup, Icon, Size } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
interface AutocompleteMultipleProps extends AutocompleteProps {
    /**
     * The list of selected values.
     */
    values: object[];

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
        choice: object,
        index: number,
        onClear?: (event: React.MouseEvent, choice: object) => void,
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
    closeOnClick: true,
    closeOnEscape: true,
    isOpen: undefined,
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

/**
 * This component allows to create a multiple autocomplete, allowing the user to select multiple values from a
 * list that can be filtered.
 *
 * @return The component.
 */
const AutocompleteMultiple: React.FC<AutocompleteMultipleProps> = (props) => {
    const {
        anchorToInput,
        className,
        children,
        chipsAlignment,
        value,
        values = DEFAULT_PROPS.values,
        onBlur,
        onChange,
        onFocus,
        onKeyDown,
        isOpen,
        closeOnClick,
        closeOnEscape,
        hasError,
        helper,
        icon,
        inputRef,
        isDisabled,
        isClearable,
        isValid,
        label,
        placeholder,
        theme,
        type,
        onClose,
        onClear,
        offset,
        placement,
        fitToAnchorWidth,
        shouldFocusOnClose,
        onInfiniteScroll,
        selectedChipRender = DEFAULT_PROPS.selectedChipRender,
        ...forwardedProps
    } = props;

    return (
        <Autocomplete
            anchorToInput={anchorToInput}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
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
                    {values!.map((chip: object, index: number) => selectedChipRender!(chip, index, onClear))}
                </ChipGroup>
            }
            isDisabled={isDisabled}
            isClearable={isClearable}
            isValid={isValid}
            label={label}
            placeholder={placeholder}
            theme={theme}
            type={type}
            isOpen={isOpen}
            closeOnClick={closeOnClick}
            closeOnEscape={closeOnEscape}
            onClose={onClose}
            offset={offset}
            placement={placement}
            fitToAnchorWidth={fitToAnchorWidth}
            onInfiniteScroll={onInfiniteScroll}
            {...forwardedProps}
        >
            {children}
        </Autocomplete>
    );
};
AutocompleteMultiple.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, AutocompleteMultiple, AutocompleteMultipleProps };
