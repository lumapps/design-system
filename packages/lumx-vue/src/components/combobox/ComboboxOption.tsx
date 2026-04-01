import { defineComponent, ref, useAttrs } from 'vue';

import {
    ComboboxOption as UI,
    type ComboboxOptionProps as UIProps,
    type ComboboxOptionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOption';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Tooltip } from '../tooltip';
import type { TooltipProps } from '../tooltip/Tooltip';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxListContext } from './context/ComboboxListContext';
import { provideComboboxOptionContext } from './context/ComboboxOptionContext';

/**
 * Adapter: maps core's `className` prop to Vue's `class` prop for Tooltip.
 * Children are received as Vue slots and forwarded to the Tooltip component.
 */
const TooltipAdapter = (p: any, { slots }: any) => {
    const { className, ...rest } = p;
    return (
        <Tooltip class={className} {...rest}>
            {{ default: slots.default }}
        </Tooltip>
    );
};

export type ComboboxOptionProps = VueToJSXProps<
    UIProps,
    ComboboxOptionPropsToOverride | 'descriptionId' | 'hidden' | 'isGrid' | 'id'
> & {
    /** Props forwarded to a Tooltip wrapping the option trigger element. */
    tooltipProps?: Partial<TooltipProps>;
    /** On option clicked (or activated with keyboard). */
    onClick?: () => void;
    /** Props forwarded to the inner action element (e.g. `{ as: 'a', href: '/foo' }`). */
    actionProps?: Record<string, any>;
};

/**
 * Combobox.Option component - wraps ListItem with option role and data-value.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxOption = defineComponent(
    (props: ComboboxOptionProps, { slots }) => {
        const attrs = useAttrs();
        const { type } = useComboboxListContext();
        const { handle } = useComboboxContext();
        const isGrid = type === 'grid';
        const optionId = useId();
        const descriptionId = useId();
        const optionRef = ref<HTMLElement | null>(null);
        const isFiltered = ref(false);

        // Provide option context to children (e.g. OptionMoreInfo)
        provideComboboxOptionContext({ optionId });

        // Register option with the combobox handle when both are available
        useWatchDisposable([handle, optionRef], ([h, element]) => {
            if (h && element) {
                return h.registerOption(element, (filtered) => {
                    isFiltered.value = filtered;
                });
            }
        });

        // Update optionRef when the option element is mounted/unmounted
        const setOptionRef = (el: Element | null) => {
            optionRef.value = el as HTMLElement | null;
        };

        /** Get slot content, falling back to attrs (JSX prop syntax used in tests). */
        const getSlotOrAttr = (name: string) => (slots[name]?.() ?? attrs[name]) as JSXElement;

        return () => {
            const before = getSlotOrAttr('before');
            const after = getSlotOrAttr('after');
            const children = slots.default?.() as JSXElement;

            return UI(
                {
                    ref: setOptionRef as any,
                    hidden: isFiltered.value,
                    value: props.value,
                    description: props.description,
                    children,
                    isSelected: props.isSelected,
                    isDisabled: props.isDisabled,
                    isGrid,
                    before,
                    after,
                    handleClick: props.onClick,
                    actionProps: props.actionProps,
                    id: optionId,
                    descriptionId,
                    tooltipProps: props.tooltipProps as any,
                    className: props.class,
                },
                { Tooltip: TooltipAdapter },
            );
        };
    },
    {
        name: 'LumxComboboxOption',
        inheritAttrs: false,
        props: keysOf<ComboboxOptionProps>()(
            'value',
            'description',
            'isDisabled',
            'isSelected',
            'tooltipProps',
            'onClick',
            'actionProps',
            'class',
        ),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxOption;
