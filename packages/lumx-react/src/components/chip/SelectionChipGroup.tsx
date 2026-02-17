import React from 'react';

import { mdiClose } from '@lumx/icons';
import { Chip, ChipGroup, Icon, LumxClassName, Tooltip, type Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { Selector } from '@lumx/core/js/types/Selector';
import { getWithSelector } from '@lumx/core/js/utils/selectors';
import { classNames } from '@lumx/core/js/utils';

import { isComponentType } from '../../utils/type/isComponentType';

import { useFocusLastChipOnBackspace } from '../../hooks/useFocusLastChipOnBackspace';

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
     * Input label, used to generate the chip group aria description
     */
    inputLabel?: string;
    /**
     * Customize how chips should render
     */
    renderChip?: (option: O) => React.ReactNode;
    /**
     * Scope for tracking purposes
     */
    scope?: string;
    /**
     * LumX theme
     */
    theme?: Theme;
    /**
     * Disabled state
     */
    isDisabled?: boolean;
    /** label to be used for accessibility purposes */
    label: string;
    /** callback for generating the tooltip for each individual chip */
    chipTooltipLabel: (chip: string) => string;
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
    inputLabel,
    renderChip,
    theme,
    isDisabled,
    chipTooltipLabel,
    label,
    ...forwardedProps
}: SelectionChipGroupProps<O>) => {
    const chipRefs = React.useRef<React.RefObject<HTMLElement>[]>([]);
    const { findPreviousEnabledChip } = useFocusLastChipOnBackspace(chipRefs, inputRef);

    return (
        <ChipGroup role="group" aria-label={label} className={block()} {...forwardedProps}>
            {value?.map((v, index) => {
                const name = getWithSelector(getOptionName, v);
                const id = getWithSelector(getOptionId, v);
                const onClick = () => {
                    const newValue = [...value];
                    const existingIndex = value.findIndex((vi) => getWithSelector(getOptionId, vi) === id);
                    if (existingIndex === -1) {
                        return;
                    }
                    // Remove value
                    newValue.splice(existingIndex, 1);

                    onChange?.(newValue);
                };
                const onKeyDown = (evt: React.KeyboardEvent) => {
                    if (evt.key !== 'Backspace') {
                        return;
                    }
                    // Activate (remove value) on Backspace pressed
                    onClick();

                    const previousChip = findPreviousEnabledChip(index - 1);
                    const input = inputRef?.current;
                    // Focus the previous chip or the input
                    (previousChip || input)?.focus();
                };

                if (!chipRefs.current[index]) {
                    chipRefs.current[index] = React.createRef<HTMLElement>();
                }
                const ref: React.Ref<HTMLElement> | undefined = chipRefs.current[index];

                const customChip = renderChip?.(v);
                const props = isComponentType(Chip)(customChip) ? customChip.props : undefined;
                const chipIsDisabled = props?.isDisabled || isDisabled;
                const chipName = typeof props?.children === 'string' ? props.children : name;
                const tooltipLabel = chipTooltipLabel(chipName);

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
                            ref={ref as any}
                            onClick={onClick}
                            onKeyDown={onKeyDown}
                            theme={theme}
                            isDisabled={chipIsDisabled}
                            tabIndex={chipIsDisabled ? -1 : 0}
                        >
                            {props?.children || name}
                        </Chip>
                    </Tooltip>
                );
            })}
        </ChipGroup>
    );
};
