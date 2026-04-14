import { defineComponent, ref, useAttrs, watch, toRef } from 'vue';

import {
    ComboboxOption as UI,
    type ComboboxOptionProps as UIProps,
    type ComboboxOptionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOption';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Tooltip } from '../tooltip';
import type { TooltipProps } from '../tooltip/Tooltip';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxListContext } from './context/ComboboxListContext';
import { provideComboboxOptionContext } from './context/ComboboxOptionContext';

export type ComboboxOptionProps = VueToJSXProps<
    UIProps,
    ComboboxOptionPropsToOverride | 'descriptionId' | 'hidden' | 'isGrid' | 'id'
> & {
    /** Props forwarded to a Tooltip wrapping the option trigger element. */
    tooltipProps?: Partial<TooltipProps>;
    /** Props forwarded to the inner action element (e.g. `{ as: 'a', href: '/foo' }`). */
    actionProps?: Record<string, any>;
};

export const emitSchema = {
    click: () => true,
};

/**
 * Combobox.Option component - wraps ListItem with option role and data-value.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxOption = defineComponent(
    (props: ComboboxOptionProps, { slots, emit }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
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
        useWatchDisposable([handle, optionRef], ([handleValue, element]) => {
            if (!handleValue || !element) return;
            return handleValue.registerOption(element, (filtered) => {
                isFiltered.value = filtered;
            });
        });

        // Re-evaluate filter state when the option value changes.
        watch(
            toRef(props, 'value'),
            () => {
                const handleValue = handle.value;
                const element = optionRef.value;
                if (!handleValue || !element) return;
                handleValue.refilterOption(element);
            },
            // ensuring data-value is committed before re-evaluating the filter.
            { flush: 'post' },
        );

        // Update optionRef when the option element is mounted/unmounted
        const setOptionRef = (el: Element | null) => {
            optionRef.value = el as HTMLElement | null;
        };

        const handleClick = () => {
            emit('click');
            // Also call attrs.onClick for compatibility with core JSX
            (attrs.onClick as any)?.();
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
                    handleClick,
                    actionProps: props.actionProps,
                    id: optionId,
                    descriptionId,
                    tooltipProps: props.tooltipProps as any,
                    className: className.value,
                },
                { Tooltip },
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
            'actionProps',
            'class',
        ),
        emits: emitSchema,
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxOption;
