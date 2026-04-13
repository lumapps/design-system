import React from 'react';

import { CLASSNAME as CHIP_CLASSNAME } from '@lumx/core/js/components/Chip';
import {
    SelectionChipGroup as UI,
    CLASSNAME,
    COMPONENT_NAME,
    type SelectionChipGroupProps as UIProps,
} from '@lumx/core/js/components/Chip/SelectionChipGroup';
import { setupSelectionChipGroupEvents } from '@lumx/core/js/components/Chip/setupSelectionChipGroupEvents';
import { GenericProps } from '@lumx/react/utils/type';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { Chip } from './Chip';
import { ChipGroup } from './ChipGroup';
import { Icon } from '../icon';
import { Text } from '../text';
import { Tooltip } from '../tooltip';
import { isComponentType } from '../../utils/type/isComponentType';
import { useRovingTabIndexContainer } from '../../hooks/useRovingTabIndexContainer';

/**
 * Defines the props of the component.
 */
export interface SelectionChipGroupProps<O> extends GenericProps, ReactToJSX<UIProps<O>> {
    /** Callback on option array selected */
    onChange?(newValue?: O[]): void;
    /** Input ref to restore focus */
    inputRef?: React.RefObject<HTMLInputElement>;
    /** Customize how chips should render (return a <Chip> element to override chip props) */
    renderChip?: (option: O) => React.ReactNode;
}

/**
 * SelectionChipGroup component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const SelectionChipGroup = <O,>({
    onChange,
    value,
    getOptionId,
    getOptionName,
    inputRef,
    renderChip,
    getChipProps: getChipPropsProp,
    theme,
    isDisabled,
    label,
    chipRemoveLabel,
    ...forwardedProps
}: SelectionChipGroupProps<O>) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Store latest values in refs so the event handlers always access current state.
    const valueRef = React.useRef(value);
    valueRef.current = value;
    const onChangeRef = React.useRef(onChange);
    onChangeRef.current = onChange;

    // Attach event listeners
    React.useEffect(() => {
        return setupSelectionChipGroupEvents({
            getContainer: () => containerRef.current,
            getInput: () => inputRef?.current,
            onChange: (newValue) => onChangeRef.current?.(newValue),
            getValue: () => valueRef.current,
            getOptionId,
        });
    }, [inputRef, getOptionId]);

    useRovingTabIndexContainer({
        containerRef,
        itemSelector: `.${CHIP_CLASSNAME}`,
        itemDisabledSelector: `.${CHIP_CLASSNAME}[aria-disabled="true"]`,
    });

    // Handle renderChip or fallback to getChipProps from props
    const getChipProps = renderChip
        ? (option: O) => {
              const customChip = renderChip(option);
              return (isComponentType(Chip)(customChip) && customChip.props) || {};
          }
        : getChipPropsProp;

    return UI(
        {
            ...forwardedProps,
            value,
            getOptionId,
            getOptionName,
            theme,
            isDisabled,
            label,
            chipRemoveLabel,
            getChipProps,
            ref: containerRef,
        },
        { Chip, ChipGroup, Icon, Text, Tooltip },
    );
};
SelectionChipGroup.displayName = COMPONENT_NAME;
SelectionChipGroup.className = CLASSNAME;
