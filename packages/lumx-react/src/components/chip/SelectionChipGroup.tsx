import React from 'react';

import { mdiClose } from '@lumx/icons';
import type { LumxClassName } from '@lumx/core/js/types';
import { type Theme } from '@lumx/core/js/constants';
import { CLASSNAME as CHIP_CLASSNAME } from '@lumx/core/js/components/Chip';
import { GenericProps } from '@lumx/react/utils/type';
import { Selector } from '@lumx/core/js/types/Selector';
import { getWithSelector } from '@lumx/core/js/utils/selectors';
import { classNames } from '@lumx/core/js/utils';

import { Chip } from './Chip';
import { ChipGroup } from './ChipGroup';
import { Icon } from '../icon';
import { Text } from '../text';
import { Tooltip } from '../tooltip';
import { Text } from '../text';
import { isComponentType } from '../../utils/type/isComponentType';
import { useRovingTabIndexContainer } from '../../hooks/useRovingTabIndexContainer';


export interface SelectionChipGroupProps<O> extends GenericProps {
    /**
     * Option object id selector (either the property name or a function to get the id)
     */
    getOptionId: Selector<O>;
    /**
     * Option object name selector (either the property name or a function to get the name)
     * Fallbacks on the ID if not defined
     */
    getOptionName?: Selector<O, string | undefined | null>;
    /**
     * Selected options array
     */
    value?: O[];
    /**
     * Callback on option array selected
     */
    onChange?(newValue?: O[]): void;
    /**
     * Input ref to restore focus
     */
    inputRef?: React.RefObject<HTMLInputElement>;
    /**
     * Customize how chips should render
     */
    renderChip?: (option: O) => React.ReactNode;
    /**
     * LumX theme
     */
    theme?: Theme;
    /**
     * Disabled state
     */
    isDisabled?: boolean;
    /**
     * Label to be used for accessibility purposes
     */
    label: string;
    /**
     * Label for the remove action (used in visually hidden text for accessibility)
     */
    chipRemoveLabel?: string;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SelectionChipGroup';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-selection-chip-group';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * SelectionChipGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
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

    if (!value || value.length === 0) {
        return null;
    }

    return (
        <ChipGroup
            ref={containerRef}
            role="listbox"
            aria-label={label}
            aria-multiselectable
            aria-orientation="horizontal"
            className={block()}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...forwardedProps}
        >
            {value?.map((v, index) => {
                const name = getWithSelector(getOptionName, v);
                const id = getWithSelector(getOptionId, v);

                const customChip = renderChip?.(v);
                const props = isComponentType(Chip)(customChip) ? customChip.props : undefined;
                const chipIsDisabled = props?.isDisabled || isDisabled;
                const chipName = typeof props?.children === 'string' ? props.children : name;
                const tooltipLabel = chipRemoveLabel ? `${chipName} \u2014 ${chipRemoveLabel}` : chipName;

                return (
                    <Tooltip
                        key={id}
                        label={!chipIsDisabled ? tooltipLabel : undefined}
                        closeMode="hide"
                        ariaLinkMode="aria-labelledby"
                    >
                        <Chip
                            {...props}
                            after={<Icon icon={mdiClose} />}
                            className={element('chip', [props?.className])}
                            size="s"
                            data-option-index={index}
                            isClickable
                            role="option"
                            aria-selected
                            theme={theme}
                            isDisabled={chipIsDisabled}
                        >
                            <Text as="span" truncate>
                                {props?.children || name}
                            </Text>
                            {chipRemoveLabel && (
                                <Text as="span" className={classNames.visuallyHidden()}>
                                    {` \u2014 `}
                                    {chipRemoveLabel}
                                </Text>
                            )}
                        </Chip>
                    </Tooltip>
                );
            })}
        </ChipGroup>
    );
};
