import { ReactNode } from 'react';

import classNames from 'classnames';

import { mdiClose } from '@lumx/icons';

import { Autocomplete, AutocompleteProps, Chip, HorizontalAlignment, Icon, Size } from '@lumx/react';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

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
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-autocomplete-multiple';

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
export const AutocompleteMultiple = forwardRef<AutocompleteMultipleProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme();
    const { disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        anchorToInput,
        children,
        // `chipsAlignment` needs to be here to remove it from `forwardedProps`.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        chipsAlignment,
        className,
        closeOnClickAway = DEFAULT_PROPS.closeOnClickAway,
        closeOnEscape = DEFAULT_PROPS.closeOnEscape,
        fitToAnchorWidth,
        hasError,
        helper,
        icon,
        inputRef,
        clearButtonProps,
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
        selectedChipRender = DEFAULT_PROPS.selectedChipRender,
        shouldFocusOnClose,
        theme = defaultTheme,
        type,
        value,
        values = DEFAULT_PROPS.values,
        ...forwardedProps
    } = otherProps;

    return (
        <Autocomplete
            ref={ref}
            {...forwardedProps}
            anchorToInput={anchorToInput}
            className={classNames(className, CLASSNAME)}
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
            chips={values && values.map((chip: any, index: number) => selectedChipRender?.(chip, index, onClear))}
            {...disabledStateProps}
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
