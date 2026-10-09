import { type EmitFn, type EmitsToProps, type PublicProps, type SlotsType, defineComponent, normalizeStyle } from 'vue';
import { type BaseSelectListWrapperProps } from '@lumx/core/js/utils/select/types';
import { toggleSelection } from '@lumx/core/js/utils/select/toggleSelection';
import type { HasAriaLabelOrLabelledBy } from '@lumx/core/js/types';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    SelectList as UI,
    type SelectListProps as UIProps,
    type SelectListWidth,
} from '@lumx/core/js/components/SelectList';
import { InfiniteScroll } from '@lumx/vue/utils/InfiniteScroll';

import { getName, keysOf, type EmitsOf } from '../../utils/VueToJSX';
import { Listbox } from '../listbox';
import { useWrappedRenderOptionSlot } from '../combobox/useWrappedRenderOptionSlot';
import { useWrappedRenderSectionTitleSlot } from '../combobox/useWrappedRenderSectionTitleSlot';
import { useHasEventListener } from '../../composables/useHasEventListener';
import { useClassName } from '../../composables/useClassName';

interface BaseSelectListProps<O = any> extends BaseSelectListWrapperProps<O> {
    /** Width of the list (t-shirt size token or percentage of the parent width). */
    width?: SelectListWidth;
    /** Minimum width of the list (t-shirt size token or percentage of the parent width). */
    minWidth?: SelectListWidth;
    class?: string;
}

interface SingleSelectListDeclaredProps<O = any> extends BaseSelectListProps<O> {
    selectionType?: 'single';
    value?: O;
}

interface MultipleSelectListDeclaredProps<O = any> extends BaseSelectListProps<O> {
    selectionType: 'multiple';
    value?: O[];
}

/** Declared Vue props (the accessible name attributes are not declared: they flow through `attrs`). */
type SelectListDeclaredProps<O = any> = SingleSelectListDeclaredProps<O> | MultipleSelectListDeclaredProps<O>;

/**
 * Single selection SelectList props.
 * The listbox requires an accessible name (`aria-label` or `aria-labelledby`).
 */
export type SingleSelectListProps<O = any> = SingleSelectListDeclaredProps<O> & HasAriaLabelOrLabelledBy;

/**
 * Multiple selection SelectList props.
 * The listbox requires an accessible name (`aria-label` or `aria-labelledby`).
 */
export type MultipleSelectListProps<O = any> = MultipleSelectListDeclaredProps<O> & HasAriaLabelOrLabelledBy;

export type SelectListProps<O = any> = SingleSelectListProps<O> | MultipleSelectListProps<O>;

/* eslint-disable @typescript-eslint/no-unused-vars */
export const emitSchema = {
    change: (_newValue: unknown) => true,
    'load-more': () => true,
};
/* eslint-enable @typescript-eslint/no-unused-vars */

type SelectListEmits<O, S extends 'single' | 'multiple'> = Omit<EmitsOf<typeof emitSchema>, 'change'> & {
    change: (newValue: S extends 'multiple' ? O[] : O) => void;
};

type SingleSelectListPublicProps<O> = SingleSelectListProps<O> & EmitsToProps<SelectListEmits<O, 'single'>>;
type MultipleSelectListPublicProps<O> = MultipleSelectListProps<O> & EmitsToProps<SelectListEmits<O, 'multiple'>>;

export interface SelectListConstructor {
    new <O = any>(
        props: SingleSelectListPublicProps<O> & PublicProps,
    ): {
        $props: SingleSelectListPublicProps<O>;
        $emit: EmitFn<SelectListEmits<O, 'single'>>;
    };
    new <O = any>(
        props: MultipleSelectListPublicProps<O> & PublicProps,
    ): {
        $props: MultipleSelectListPublicProps<O>;
        $emit: EmitFn<SelectListEmits<O, 'multiple'>>;
    };
}

/**
 * A list of options always visible on the page (WAI-ARIA listbox pattern), for single or multiple selection.
 *
 * The listbox is a single tab stop: the arrow keys (and typeahead) move between the options,
 * and Enter, Space or a click selects the active option.
 *
 * @family Inputs
 *
 * @param props Component props.
 * @return Vue element.
 */
const SelectList = defineComponent(
    (props: SelectListDeclaredProps, { emit, slots, attrs }) => {
        // Merge `class` prop with `className` attr (React-style attr from core JSX).
        const className = useClassName(() => props.class);

        const renderOption = useWrappedRenderOptionSlot(slots.option);
        const renderSectionTitle = useWrappedRenderSectionTitleSlot(slots.sectionTitle);

        // Map the core's option-id selection back to the option object(s).
        // The list is always visible (no clear button): selecting the selected option again deselects it.
        const handleSelect = (selectedOption: { value: string }) => {
            const next = toggleSelection(
                props.options,
                props.getOptionId,
                props.value,
                selectedOption?.value,
                props.selectionType === 'multiple',
                true,
            );
            emit('change', next);
        };

        // Only enable infinite scroll when a `load-more` listener is bound.
        const hasLoadMoreListener = useHasEventListener('onLoadMore') || useHasEventListener('onLoad-more');
        const onLoadMore = () => emit('load-more');

        return () =>
            UI(
                {
                    // Includes `aria-label` / `aria-labelledby` (forwarded to the listbox by the core template).
                    ...attrs,
                    // Normalize the `style` attr (string, array or object) into an object the core can extend.
                    style: normalizeStyle(attrs.style) as Record<string, any> | undefined,
                    className: className.value,
                    width: props.width,
                    minWidth: props.minWidth,
                    options: props.options,
                    getOptionId: props.getOptionId as any,
                    getOptionName: props.getOptionName as any,
                    getOptionDescription: props.getOptionDescription as any,
                    renderOption: renderOption.value as any,
                    getSectionId: props.getSectionId as any,
                    renderSectionTitle: renderSectionTitle.value as any,
                    value: props.value,
                    selectionType: props.selectionType ?? DEFAULT_PROPS.selectionType,
                    handleSelect,
                    listStatus: props.listStatus ?? 'idle',
                    translations: props.translations,
                    onLoadMore: hasLoadMoreListener ? onLoadMore : undefined,
                    infiniteScrollOptions: { rootMargin: '100px' },
                    // `aria-label` / `aria-labelledby` come from `attrs` (not typed there).
                } as UIProps<unknown>,
                { Listbox, InfiniteScroll },
            );
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        slots: Object as SlotsType<{
            option: { option: unknown; index: number };
            sectionTitle: { sectionId: string | undefined; options: unknown[] };
        }>,
        props: keysOf<SelectListDeclaredProps<unknown>>()(
            'options',
            'getOptionId',
            'getOptionName',
            'getOptionDescription',
            'getSectionId',
            'selectionType',
            'value',
            'width',
            'minWidth',
            'listStatus',
            'translations',
            'class',
        ),
        emits: emitSchema,
    },
);

export default SelectList as unknown as SelectListConstructor & typeof SelectList;
export { DEFAULT_PROPS, CLASSNAME };
