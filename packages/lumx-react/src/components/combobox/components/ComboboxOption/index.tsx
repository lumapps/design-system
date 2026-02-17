/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import { classNames } from '@lumx/core/js/utils';
import { GenericBlock, Size, Tooltip, Text } from '@lumx/react';
import { MovingFocusContext, useVirtualFocus } from '@lumx/react/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { GenericProps } from '@lumx/core/js/types';

import { ComboboxOptionContextProvider } from '../../context/ComboboxOptionContext';
import { useCombobox } from '../../hooks/useCombobox';
import { useComboboxSectionId } from '../../hooks/useComboboxSectionId';
import { useRegisterOption } from '../../hooks/useRegisterOption';
import { ComboboxOptionProps, RegisteredComboboxOptionValue } from '../../types';
import { generateOptionId } from '../../utils';

export const COMBOBOX_OPTION_CLASSNAME = 'lumx-combobox-option';
export const LUMX_CLASSNAME = 'lumx-list-item';

interface OptionContentProps<O extends object = any>
    extends GenericProps,
        Omit<ComboboxOptionProps<O>, 'id' | 'textValue' | 'filterFromInput' | 'data'> {
    id: string;
    isSelected?: boolean;
    onSelect?(): void;
    description?: string;
    /** Whether the option should be focused by default. */
    autofocus?: boolean;
    /** Customize the root element. */
    as?: React.ElementType;
    /** Type of the combobox (listbox or grid). */
    comboboxType?: 'listbox' | 'grid';
}

const { block, element } = classNames.bem(COMBOBOX_OPTION_CLASSNAME);
const lumxListItem = classNames.bem(LUMX_CLASSNAME);

/**
 * Content of the option.
 * This should only be rendered if the option is shown.
 */
const OptionContent = forwardRef<OptionContentProps, HTMLElement>((props, ref) => {
    const {
        id,
        onSelect,
        isSelected,
        isDisabled,
        children,
        className,
        before,
        after,
        as,
        size = Size.tiny,
        comboboxType,
        tooltipProps,
        description,
        'aria-hidden': ariaHidden,
        autofocus,
        ...forwardedProps
    } = props;

    const itemRef = React.useRef<HTMLLIElement>(null);
    const { state } = React.useContext(MovingFocusContext);
    const { selectedIds } = useCombobox();
    const hasSelection = selectedIds !== undefined;
    const isHighlighted = useVirtualFocus(id, itemRef, false, comboboxType === 'grid' ? id : undefined, autofocus);

    const Element = as || 'span';
    const ariaSelected = isSelected ? 'true' : 'false';
    const ariaDescriptionId = description ? `${id}-description` : undefined;
    const isKeyboardHighlighted = state.isUsingKeyboard && isHighlighted;

    /**
     * The DS `ListItem` component has a lot of behavior / default props we do not want here.
     * Notably the before/after items are within the interactive element, which we do not want.
     * So we use a native li tag.
     */
    return (
        <li
            className={block(undefined, [className ?? '', lumxListItem.block({ [`size-${size}`]: !!size })])}
            role="presentation"
            ref={itemRef}
            aria-hidden={ariaHidden}
            style={{ display: ariaHidden ? 'none' : undefined }}
            {...forwardedProps}
        >
            <GenericBlock
                as="div"
                role={comboboxType === 'grid' ? 'row' : 'presentation'}
                className={element(
                    'content',
                    {
                        // Not using the lumx list item disabled style as it blocks pointer events
                        'is-disabled': !!isDisabled,
                    },
                    // TODO: migrate away from using lumx-list-item styles https://lumapps.atlassian.net/browse/DSW-288
                    [
                        lumxListItem.element('link', {
                            'is-selected': Boolean(isSelected),
                            'is-highlighted': Boolean(isHighlighted),
                        }),
                    ],
                )}
                data-focus-visible-added={isKeyboardHighlighted ? 'true' : undefined}
            >
                {before && (
                    <GenericBlock.Figure
                        as="span"
                        role="presentation"
                        className={element('before', undefined, [lumxListItem.element('before')])}
                    >
                        {before}
                    </GenericBlock.Figure>
                )}

                <GenericBlock.Content as="span" role="presentation" className={lumxListItem.element('content')}>
                    <Tooltip forceOpen={isKeyboardHighlighted} closeMode="hide" {...tooltipProps}>
                        <Element
                            id={id}
                            className={element('trigger')}
                            role={comboboxType === 'grid' ? 'gridcell' : 'option'}
                            aria-selected={hasSelection ? ariaSelected : undefined}
                            aria-disabled={isDisabled}
                            aria-describedby={ariaDescriptionId}
                            onClick={onSelect}
                            // Prevent mouse down to avoid blur before the click is activated
                            onMouseDown={(event: Event) => event.preventDefault()}
                            ref={ref}
                            {...forwardedProps}
                        >
                            {children}
                        </Element>
                    </Tooltip>

                    {description && (
                        <Text
                            as="span"
                            id={ariaDescriptionId}
                            role="presentation"
                            className={element('description')}
                            typography="caption"
                            color="dark"
                            colorVariant="L2"
                        >
                            {description}
                        </Text>
                    )}
                </GenericBlock.Content>

                {after && (
                    <GenericBlock.Actions
                        as="span"
                        role="presentation"
                        className={element('after', undefined, [lumxListItem.element('after')])}
                    >
                        <ComboboxOptionContextProvider optionId={id} isKeyboardHighlighted={isKeyboardHighlighted}>
                            {after}
                        </ComboboxOptionContextProvider>
                    </GenericBlock.Actions>
                )}
            </GenericBlock>
        </li>
    );
});

/**
 * Props for ComboboxOption with additional generic properties.
 */
export interface ComboboxOptionComponentProps<O extends object = any>
    extends GenericProps,
        Omit<ComboboxOptionProps<O>, 'as'> {
    /** Customize the root element. */
    as?: React.ElementType;
}

/**
 * Option to set within a combobox list.
 *
 * @family Combobox
 * @param ComboboxOptionProps
 * @returns ComboboxOption
 */
export const ComboboxOption = forwardRef<ComboboxOptionComponentProps, HTMLElement>((props, ref) => {
    const {
        children,
        id,
        textValue,
        data,
        filterFromInput = true,
        onSelect: onOptionSelect,
        isDisabled,
        as = 'span',
        ...optionProps
    } = props;

    // Get the id of the current group, if any.
    const section = useComboboxSectionId();
    const { comboboxId, selectedIds, showAll, inputValue, handleSelected, type } = useCombobox();
    // Generate a unique id for this option.
    const generatedId = generateOptionId(comboboxId, id);

    const isSelected = selectedIds?.includes(generatedId);

    // If no text value is set and the direct child is a simple string, use it as value.
    const isStringChild = typeof children === 'string' || typeof children === 'number';
    const value = children && !textValue && isStringChild ? children.toString() : textValue;

    const showOption =
        !filterFromInput || showAll || value?.toString()?.toLowerCase().includes(inputValue?.toLowerCase());

    const registeredOption: RegisteredComboboxOptionValue = React.useMemo(
        () => ({
            id,
            generatedId,
            textValue: value,
            data,
            filter: filterFromInput,
            isDisabled: isDisabled || !showOption,
            sectionId: section.sectionId,
            onSelect: onOptionSelect,
        }),
        [data, filterFromInput, generatedId, section.sectionId, id, isDisabled, onOptionSelect, showOption, value],
    );

    // Register the option
    useRegisterOption(generatedId, registeredOption, showOption);

    const handleSelect = React.useCallback(
        () => handleSelected(registeredOption, 'click'),
        [handleSelected, registeredOption],
    );

    if (!id || !showOption) {
        return null;
    }

    return (
        <OptionContent
            id={generatedId}
            onSelect={handleSelect}
            isSelected={isSelected}
            isDisabled={isDisabled}
            as={as}
            ref={ref}
            comboboxType={type}
            aria-hidden={section.isLoading}
            {...optionProps}
        >
            {children || textValue}
        </OptionContent>
    );
});
