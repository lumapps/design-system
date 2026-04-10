import { type ComponentPublicInstance, computed, defineComponent, ref, useAttrs, watchEffect } from 'vue';

import {
    SelectionChipGroup as UI,
    type SelectionChipGroupProps as UIProps,
} from '@lumx/core/js/components/Chip/SelectionChipGroup';
import { CLASSNAME as CHIP_CLASSNAME } from '@lumx/core/js/components/Chip';
import { setupSelectionChipGroupEvents } from '@lumx/core/js/components/Chip/setupSelectionChipGroupEvents';

import { useClassName } from '../../composables/useClassName';
import { useTheme } from '../../composables/useTheme';
import { useRovingTabIndexContainer } from '../../composables/useRovingTabIndexContainer';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { isComponentType } from '../../utils/isComponentType';
import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
import { Text } from '../text';

import Chip from './Chip';
import ChipGroup from './ChipGroup';

/**
 * Props omit 'ref' (handled internally).
 * inputRef is added here for Vue (ref to an associated input element for backspace focus handling).
 */
export type SelectionChipGroupProps = VueToJSXProps<UIProps<any>> & {
    /** Ref to the associated input element (for focus restoration on backspace) */
    inputRef?: HTMLInputElement | null;
};

export const emitSchema = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_newValue?: any[]) => true,
};

/**
 * SelectionChipGroup component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const SelectionChipGroup = defineComponent(
    (props: SelectionChipGroupProps, { emit, slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const defaultTheme = useTheme();
        const containerRef = ref<ComponentPublicInstance | null>(null);

        // Unwrap Vue component instance to the root DOM element
        const getContainer = (): HTMLElement | null => containerRef.value?.$el ?? containerRef.value ?? null;

        // Attach event listeners
        watchEffect((onCleanup) => {
            const cleanup = setupSelectionChipGroupEvents({
                getContainer,
                getInput: () => props.inputRef,
                onChange: (newValue) => emit('change', newValue),
                getValue: () => props.value,
                getOptionId: props.getOptionId,
            });
            onCleanup(cleanup);
        });

        const containerUnwrapped = computed(getContainer);
        useRovingTabIndexContainer({
            containerRef: containerUnwrapped,
            itemSelector: `.${CHIP_CLASSNAME}`,
            itemDisabledSelector: `.${CHIP_CLASSNAME}[aria-disabled="true"]`,
        });

        return () => {
            // Handle scoped slot or fallback to getChipProps
            const getChipProps = slots.chip
                ? (option: any) => {
                      const vnodes = slots.chip?.({ option });
                      const customChip = vnodes?.find(isComponentType(Chip));
                      const chipProps = customChip?.props || {};
                      // Handle the before slot
                      const beforeSlot = (customChip?.children as any)?.before;
                      if (beforeSlot) chipProps.before = beforeSlot();
                      return chipProps;
                  }
                : props.getChipProps;

            const { class: _class, ...restProps } = props;

            return UI(
                {
                    ...attrs,
                    ...restProps,
                    className: className.value,
                    theme: props.theme || defaultTheme.value,
                    getChipProps,
                    ref: containerRef,
                },
                { Chip, ChipGroup, Icon, Tooltip, Text },
            );
        };
    },
    {
        name: 'LumxSelectionChipGroup',
        inheritAttrs: false,
        props: keysOf<SelectionChipGroupProps>()(
            'getChipProps',
            'getOptionId',
            'getOptionName',
            'value',
            'label',
            'chipRemoveLabel',
            'isDisabled',
            'theme',
            'class',
            'inputRef',
        ),
        emits: emitSchema,
    },
);

export default SelectionChipGroup;
