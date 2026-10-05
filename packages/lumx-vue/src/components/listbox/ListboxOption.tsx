import { defineComponent, ref, useAttrs, watch, toRef } from 'vue';

import {
    ListboxOption as UI,
    type ListboxOptionProps as UIProps,
    type ListboxOptionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxOption';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Tooltip } from '../tooltip';
import type { TooltipProps } from '../tooltip/Tooltip';
import { useListboxContext } from './context/ListboxContext';
import { provideListboxOptionContext } from './context/ListboxOptionContext';
import { useListboxEvent } from './context/useListboxEvent';
import { optionActiveEvent } from '@lumx/core/js/components/Listbox/constants';

export type ListboxOptionProps = VueToJSXProps<
    UIProps,
    ListboxOptionPropsToOverride | 'descriptionId' | 'hidden' | 'isGrid' | 'id'
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
const ListboxOption = defineComponent(
    (props: ListboxOptionProps, { slots, emit }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const { type, list } = useListboxContext();
        const isGrid = type === 'grid';
        const optionId = useId();
        const descriptionId = useId();
        const optionRef = ref<HTMLElement | null>(null);
        const isFiltered = ref(false);

        // Force the tooltip open while the option is the active descendant (keyboard highlight).
        const isActive = useListboxEvent(list, optionActiveEvent(optionId), false);

        // Provide option context to children (e.g. OptionMoreInfo)
        provideListboxOptionContext({
            optionId,
            // Getter: keeps the provided `isSelected` reactive.
            get isSelected() {
                return Boolean(props.isSelected);
            },
        });

        // Register option with the combobox handle when both are available
        useWatchDisposable([list, optionRef], ([listValue, element]) => {
            if (!listValue || !element) return;
            return listValue.registerOption(element, (filtered) => {
                isFiltered.value = filtered;
            });
        });

        // Re-evaluate filter state when the option value changes.
        watch(
            toRef(props, 'value'),
            () => {
                const listValue = list.value;
                const element = optionRef.value;
                if (!listValue || !element) return;
                listValue.refilterOption(element);
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
            const { tooltipProps } = props;

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
                    tooltipProps: (tooltipProps && {
                        ...tooltipProps,
                        forceOpen: tooltipProps.forceOpen || isActive.value,
                    }) as any,
                    className: className.value,
                },
                { Tooltip },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ListboxOptionProps>()(
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
export default ListboxOption;
