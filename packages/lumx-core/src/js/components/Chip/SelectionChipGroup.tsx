import { mdiClose } from '@lumx/icons';

import type { LumxClassName, HasClassName, HasTheme } from '../../types';
import type { Selector } from '../../types/Selector';
import { classNames } from '../../utils';
import { getWithSelector } from '../../utils/selectors';
import type { ChipProps } from '.';

/**
 * Framework-specific components injected by React/Vue wrappers.
 */
export interface SelectionChipGroupComponents {
    Chip: any;
    ChipGroup: any;
    Icon: any;
    Text: any;
    Tooltip: any;
}

/**
 * Props that consumers can override per chip via getChipProps.
 * Excludes internal/framework props that the core always controls.
 */
export type ChipOverrideProps = Pick<
    ChipProps,
    'isDisabled' | 'color' | 'isHighlighted' | 'isSelected' | 'className' | 'before' | 'after'
>;

/**
 * Defines the props of the component.
 */
export interface SelectionChipGroupProps<O> extends HasClassName, HasTheme {
    /** Option object id selector (either a property name or a function to get the id) */
    getOptionId: Selector<O>;
    /** Option object name selector. Falls back to the id if not defined */
    getOptionName?: Selector<O, string | undefined | null>;
    /** Selected options array */
    value?: O[];
    /** Label for accessibility (aria-label on the listbox) */
    label: string;
    /** Label for the remove action (visually hidden text appended to each chip) */
    chipRemoveLabel?: string;
    /** Disabled state for all chips */
    isDisabled?: boolean;
    /** Customize chip props per option */
    getChipProps?: (option: O) => Partial<ChipProps>;
    /** Ref for the container element */
    ref?: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'SelectionChipGroup';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-selection-chip-group';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * SelectionChipGroup component.
 * Renders a listbox of removable selection chips using component injection for framework-agnostic rendering.
 *
 * @param props      Component props.
 * @param components Framework-specific components injected by the wrapper (Chip, ChipGroup, Icon, Tooltip).
 * @return JSX element, or null when value is empty.
 */
export const SelectionChipGroup = <O,>(
    props: SelectionChipGroupProps<O>,
    { Chip, ChipGroup, Icon, Text, Tooltip }: SelectionChipGroupComponents,
) => {
    const {
        value,
        getOptionId,
        getOptionName,
        label,
        chipRemoveLabel,
        isDisabled,
        theme,
        className,
        getChipProps,
        ref,
        ...forwardedProps
    } = props;

    if (!value || value.length === 0) return null;

    return (
        <ChipGroup
            {...forwardedProps}
            ref={ref}
            role="listbox"
            aria-label={label}
            aria-multiselectable="true"
            aria-orientation="horizontal"
            className={block([className])}
        >
            {value.map((v) => {
                const name = (getOptionName && getWithSelector(getOptionName, v)) || getWithSelector(getOptionId, v);
                const id = getWithSelector(getOptionId, v);

                // Merge custom overrides with defaults
                const customProps = getChipProps?.(v) || {};
                const chipIsDisabled = customProps.isDisabled || isDisabled;
                const chipName = typeof customProps.children === 'string' ? customProps.children : name;
                const ariaLabel = chipRemoveLabel ? `${chipName} - ${chipRemoveLabel}` : chipName;

                return (
                    <Tooltip key={id} label={!chipIsDisabled ? ariaLabel : undefined}>
                        <Chip
                            aria-label={ariaLabel}
                            {...customProps}
                            size="s"
                            after={<Icon icon={mdiClose} />}
                            className={element('chip', [customProps.className])}
                            data-option-id={id}
                            isClickable
                            role="option"
                            aria-selected="true"
                            theme={theme}
                            isDisabled={chipIsDisabled}
                        >
                            <Text as="span" truncate>
                                {customProps.children || name}
                            </Text>
                        </Chip>
                    </Tooltip>
                );
            })}
        </ChipGroup>
    );
};
