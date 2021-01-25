import { mdiClose } from '@lumx/icons';
import { Autocomplete, AutocompleteProps, Chip, ChipGroup, HorizontalAlignment, Icon, Size } from '@lumx/react';

import { Comp, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface AutocompleteMultipleProps extends AutocompleteProps {
    /** Selected values. */
    values: any[];
    /** Alignment of the chips in the autocomplete. */
    chipsAlignment?: HorizontalAlignment;
    /** Selected value render function. Default: Renders the value inside of a Chip. */
    selectedChipRender(
        choice: any,
        index: number,
        onClear?: (event: React.MouseEvent, choice: any) => void,
        isDisabled?: boolean,
    ): ReactNode | string;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'AutocompleteMultiple';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
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

/**
 * AutocompleteMultiple component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const AutocompleteMultiple: Comp<AutocompleteMultipleProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
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
        isRequired,
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
    } = props;

    return (
        <Autocomplete
            ref={ref}
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
            chips={values && values.map((chip: any, index: number) => selectedChipRender(chip, index, onClear))}
            isDisabled={isDisabled}
            isRequired={isRequired}
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
});
AutocompleteMultiple.displayName = COMPONENT_NAME;
AutocompleteMultiple.className = CLASSNAME;
AutocompleteMultiple.defaultProps = DEFAULT_PROPS;
