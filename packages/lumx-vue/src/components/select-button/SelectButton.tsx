import {
    type ComponentPublicInstance,
    type EmitFn,
    type EmitsToProps,
    type PublicProps,
    type SlotsType,
    computed,
    defineComponent,
    ref,
} from 'vue';

import { mdiMenuDown } from '@lumx/icons';
import { type BaseSelectButtonWrapperProps } from '@lumx/core/js/utils/select/types';
import { toggleSelection } from '@lumx/core/js/utils/select/toggleSelection';
import { SelectButton as UI, type SelectButtonProps as UIProps } from '@lumx/core/js/components/SelectButton';
import type { ComboboxButtonProps } from '@lumx/core/js/components/Combobox/ComboboxButton';
import { InfiniteScroll } from '@lumx/vue/utils/InfiniteScroll';
import { JSXElement } from '@lumx/core/js/types';

import { keysOf, type EmitsOf } from '../../utils/VueToJSX';
import { Combobox } from '../combobox';
import { Button } from '../button';
import { useWrappedRenderOptionSlot } from '../combobox/useWrappedRenderOptionSlot';
import { useWrappedRenderSectionTitleSlot } from '../combobox/useWrappedRenderSectionTitleSlot';
import { useHasEventListener } from '../../composables/useHasEventListener';
import { useClassName } from '../../composables/useClassName';
import { useDisableStateProps } from '../../composables/useDisableStateProps';

/**
 * Props exposed to the `#button` scoped slot of `<SelectButton>`.
 *
 * `buttonProps` **must** be spread on the slot root element so that the combobox ARIA
 * attributes (`role="combobox"`, `aria-controls`, `aria-haspopup`, `aria-expanded`,
 * `aria-activedescendant`) and the internal `ref` callback reach the underlying DOM node.
 *
 * The `<Tooltip label={label}>` wrapper is always rendered around the slot root, keeping
 * accessibility semantics consistent regardless of the element returned by the slot.
 *
 * @example
 * ```html
 * <!-- IconButton trigger (no text children — use labelDisplayMode="show-tooltip") -->
 * <SelectButton label="More" label-display-mode="show-tooltip" ...>
 *   <template #button="{ buttonProps, label }">
 *     <IconButton v-bind="buttonProps" :icon="mdiDotsVertical" :label="label" :hide-tooltip="true" />
 *   </template>
 * </SelectButton>
 *
 * <!-- Chip trigger -->
 * <SelectButton label="Status" ...>
 *   <template #button="{ buttonProps, children }">
 *     <Chip v-bind="buttonProps" is-clickable>{{ children }}</Chip>
 *   </template>
 * </SelectButton>
 * ```
 */
export interface SelectButtonButtonSlotProps {
    /**
     * Merged props that **must** be spread on the slot root element.
     *
     * Contains: `role="combobox"`, `aria-controls`, `aria-haspopup="listbox"`,
     * `aria-expanded`, `aria-activedescendant=""`, the internal `ref` callback,
     * `className`, and any caller-provided button attrs.
     */
    buttonProps: Record<string, any>;
    /**
     * The configured label (always defined).
     * Useful for setting the `label` prop of `<IconButton>` or `<Tooltip>`.
     */
    label: string;
    /**
     * Resolved button children computed from `labelDisplayMode`:
     * - `'show-selection'` — selected option name, falls back to the label when nothing is selected.
     * - `'show-label'` — always the label.
     * - `'show-tooltip'` — `null` (label is surfaced only via the Tooltip; ignore this in the slot).
     */
    children: string | null;
}

/** Common props shared by single and multi modes. */
interface BaseSelectButtonProps<O = any> extends BaseSelectButtonWrapperProps<O> {
    /** Controls how the label/value is displayed in the button. */
    labelDisplayMode?: UIProps<O>['labelDisplayMode'];
    /** Props forwarded to the Combobox.Popover. */
    popoverProps?: Record<string, any>;
    /** CSS class. */
    class?: string;
}

/**
 * Single-selection props (`selectionType` defaults to `'single'`).
 * Backwards-compatible — existing consumers do not need to set `selectionType`.
 */
export interface SingleSelectButtonProps<O = any> extends BaseSelectButtonProps<O> {
    /** Selection type. Optional — defaults to `'single'`. */
    selectionType?: 'single';
    /** Selected option (or `undefined` when nothing is selected). */
    value?: O;
}

/** Multi-selection props (`selectionType: 'multiple'` is required to opt in). */
export interface MultipleSelectButtonProps<O = any> extends BaseSelectButtonProps<O> {
    /** Selection type. */
    selectionType: 'multiple';
    /** Selected options. */
    value?: O[];
}

/**
 * SelectButton props — supports both single and multi selection.
 * Discriminated on `selectionType`: when `'multiple'`, `value` is `O[]`.
 */
export type SelectButtonProps<O = any> = SingleSelectButtonProps<O> | MultipleSelectButtonProps<O>;

/**
 * SelectButton events schema
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const emitSchema = {
    /**
     * Selection change. Payload type depends on `selectionType`:
     * - default / `'single'` → `O | undefined` (option on select).
     * - `'multiple'`         → `O[] | undefined` (toggled array).
     *
     * The runtime validator uses `unknown` since the typed payload can't be expressed
     * without the component generic. The typed payload is restored via `SelectButtonEmits`.
     */
    change: (_newValue?: unknown) => true,
    /** Bottom of the options list reached — consumer should fetch the next page. */
    'load-more': () => true,
    /** Dropdown opened or closed. */
    open: (_isOpen: boolean) => true,
};
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * SelectButton emits typed over the option type O and the selection type S.
 */
type SelectButtonEmits<O, S extends 'single' | 'multiple'> = Omit<EmitsOf<typeof emitSchema>, 'change'> & {
    change: (newValue: (S extends 'multiple' ? O[] : O) | undefined) => void;
};

type SingleSelectButtonPublicProps<O> = SingleSelectButtonProps<O> & EmitsToProps<SelectButtonEmits<O, 'single'>>;
type MultipleSelectButtonPublicProps<O> = MultipleSelectButtonProps<O> & EmitsToProps<SelectButtonEmits<O, 'multiple'>>;

/**
 * SelectButton component constructor with generic type attached to props.
 *
 * Vue's `defineComponent` setup-fn overload cannot carry an unbound generic from the setup
 * signature to the resulting component constructor, so the generic is layered on via cast.
 *
 * Two `new` overloads provide per-branch emit narrowing matching `SelectTextField`.
 */
export interface SelectButtonConstructor {
    new <O = any>(
        props: SingleSelectButtonPublicProps<O> & PublicProps,
    ): {
        $props: SingleSelectButtonPublicProps<O>;
        $emit: EmitFn<SelectButtonEmits<O, 'single'>>;
    };
    new <O = any>(
        props: MultipleSelectButtonPublicProps<O> & PublicProps,
    ): {
        $props: MultipleSelectButtonPublicProps<O>;
        $emit: EmitFn<SelectButtonEmits<O, 'multiple'>>;
    };
}

/**
 * A Button with a select dropdown to choose between a list of options.
 *
 * Scoped slots:
 * - `button({ buttonProps, label, content })` — replaces the default `<Button rightIcon={mdiMenuDown}>` trigger.
 *   `buttonProps` **must** be spread on the slot root so that the combobox ARIA attributes and `ref`
 *   reach the DOM node. The `<Tooltip>` wrapper is always rendered. See `SelectButtonButtonSlotProps`.
 * - `option({ option, index })` — custom option rendering inside a `<Combobox.Option>`.
 * - `sectionTitle({ sectionId, options })` — custom section header rendering.
 */
const SelectButton = defineComponent(
    (props: SelectButtonProps, { emit, slots, attrs }) => {
        // ComboboxList is a Vue component, so the ref resolves to its instance — Vue 3 auto-sets
        // `$el` to the root DOM node (the `<ul>`).
        const listRef = ref<ComponentPublicInstance | null>(null);

        // Merge `class` prop with `className` attr (React-style attr from core JSX).
        const className = useClassName(() => props.class);

        /*
         * Resolve disabled state from props and any React-named attrs (`ariaDisabled`,
         * `aria-disabled`) forwarded by the core JSX layer.
         */
        const { disabledStateProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs }) as Record<string, unknown>),
        );

        /** Adapt the 'option' scoped slots to the core JSX renderOption. */
        const renderOption = useWrappedRenderOptionSlot(slots.option);

        /** Adapt the 'sectionTitle' scoped slots to the core JSX renderSectionTitle. */
        const renderSectionTitle = useWrappedRenderSectionTitleSlot(slots.sectionTitle);

        /** Render button (default Button or custom one) */
        const renderButton = computed(
            (): ComboboxButtonProps['renderButton'] =>
                ({ className: buttonClass, children, ref: triggerRef, ...otherProps }) => {
                    const buttonProps = { class: buttonClass, ref: triggerRef, ...otherProps };

                    // Default button render
                    if (!slots.button) {
                        return (
                            <Button rightIcon={mdiMenuDown} {...buttonProps}>
                                {children}
                            </Button>
                        ) as JSXElement;
                    }

                    // Custom button render
                    return slots.button({ buttonProps, label: props.label, children }) as JSXElement;
                },
        );

        const isMultiple = computed(() => props.selectionType === 'multiple');

        const handleSelect = (selectedOption: { value: string }) => {
            const next = toggleSelection(
                props.options,
                props.getOptionId,
                props.value,
                selectedOption?.value,
                isMultiple.value,
            );
            // Preserve previous behaviour of normalizing falsy single-mode results to `undefined`.
            emit('change', next || undefined);
        };

        /*
         * Check if a 'load-more' listener is registered on this component
         * (EmitsToProps mapping for the 'load-more' event produces 'onLoad-more').
         */
        const hasLoadMoreListener = useHasEventListener('onLoadMore') || useHasEventListener('onLoad-more');
        const onLoadMore = () => emit('load-more');

        return () => {
            const listStatus = props.listStatus ?? 'idle';

            return UI(
                {
                    options: props.options,
                    getOptionId: props.getOptionId as any,
                    getOptionName: props.getOptionName as any,
                    getOptionDescription: props.getOptionDescription as any,
                    renderOption: renderOption.value as any,
                    getSectionId: props.getSectionId as any,
                    renderSectionTitle: renderSectionTitle.value as any,
                    value: props.value,
                    isMultiselectable: isMultiple.value,
                    label: props.label,
                    labelDisplayMode: props.labelDisplayMode,
                    buttonProps: {
                        ...attrs,
                        ...disabledStateProps.value,
                        className: className.value,
                        renderButton: renderButton.value,
                    },
                    popoverProps: props.popoverProps,
                    listProps: { ref: listRef },
                    handleSelect,
                    listStatus,
                    onOpen: (isOpen: boolean) => emit('open', isOpen),
                    translations: props.translations,
                    onLoadMore: hasLoadMoreListener ? onLoadMore : undefined,
                    infiniteScrollOptions: { root: listRef.value?.$el ?? null, rootMargin: '100px' },
                },
                { Combobox, InfiniteScroll },
            );
        };
    },
    {
        name: 'LumxSelectButton',
        inheritAttrs: false,
        slots: Object as SlotsType<{
            /**
             * Replaces the default `<Button rightIcon={mdiMenuDown}>` trigger.
             * `buttonProps` must be spread on the root element of the slot.
             */
            button: SelectButtonButtonSlotProps;
            /** Custom option rendering inside a `<SelectButtonOption>`. */
            option: { option: unknown; index: number };
            /** Custom section header rendering. */
            sectionTitle: { sectionId: string | undefined; options: unknown[] };
        }>,
        props: keysOf<SelectButtonProps<unknown>>()(
            'options',
            'getOptionId',
            'getOptionName',
            'getOptionDescription',
            'getSectionId',
            'selectionType',
            'value',
            'label',
            'labelDisplayMode',
            'popoverProps',
            'listStatus',
            'translations',
            'class',
        ),
        emits: emitSchema,
    },
);

export default SelectButton as unknown as SelectButtonConstructor & typeof SelectButton;
