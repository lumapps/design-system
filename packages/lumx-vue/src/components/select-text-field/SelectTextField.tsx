import {
    type ComponentPublicInstance,
    type EmitFn,
    type EmitsToProps,
    type PublicProps,
    computed,
    defineComponent,
    ref,
    watch,
} from 'vue';

import { type BaseSelectTextFieldWrapperProps } from '@lumx/core/js/utils/select/types';
import { getOptionDisplayName } from '@lumx/core/js/utils/select/getOptionDisplayName';
import { toggleSelection } from '@lumx/core/js/utils/select/toggleSelection';
import { SelectTextField as UI } from '@lumx/core/js/components/SelectTextField';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, type ClassValue, type EmitsOf } from '../../utils/VueToJSX';
import { Combobox } from '../combobox';
import { useWrappedRenderOptionSlot } from '../combobox/useWrappedRenderOptionSlot';
import { useWrappedRenderSectionTitleSlot } from '../combobox/useWrappedRenderSectionTitleSlot';
import SelectionChipGroup from '../chip/SelectionChipGroup';
import { InfiniteScroll } from '@lumx/vue/utils/InfiniteScroll';
import { useHasEventListener } from '../../composables/useHasEventListener';
import { useClassName } from '../../composables/useClassName';
import { useDisableStateProps } from '../../composables/useDisableStateProps';

/** Props shared across single and multiple selection modes. */
interface BaseSelectTextFieldProps<O = any> extends BaseSelectTextFieldWrapperProps<O> {
    /** Content to render before the options list. */
    beforeOptions?: JSXElement;
    /** CSS class. */
    class?: ClassValue;
}

/** Props specific to single selection mode. */
export interface SingleSelectTextFieldProps<O = any> extends BaseSelectTextFieldProps<O> {
    /** Selection type. */
    selectionType: 'single';
    /** Selected option object. */
    value?: O;
}

/** Props specific to multiple selection mode. */
export interface MultipleSelectTextFieldProps<O = any> extends BaseSelectTextFieldProps<O> {
    /** Selection type. */
    selectionType: 'multiple';
    /** Selected option objects. */
    value?: O[];
}

/**
 * SelectTextField props — supports both single and multiple selection.
 * Discriminated on `selectionType`: when `'multiple'`, `value` is `O[]`.
 */
export type SelectTextFieldProps<O = any> = SingleSelectTextFieldProps<O> | MultipleSelectTextFieldProps<O>;

/**
 * SelectTextField events schema
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const emitSchema = {
    /**
     * Selection change. Payload type depends on `selectionType`:
     * - `'single'`   → `O | undefined` (option on select, `undefined` on clear).
     * - `'multiple'` → `O[] | undefined` (`undefined` when fully cleared).
     *
     * The runtime validator uses `unknown` since the discriminated payload can't be
     * expressed without the component generic. The typed payload is restored by the
     * `change` override on `SelectTextFieldEmits<O, S>`.
     */
    change: (_newValue?: unknown) => true,
    /** User typed in the search input. */
    search: (_searchText: string) => true,
    /** Bottom of the options list reached — consumer should fetch the next page. */
    'load-more': () => true,
    /** Input lost focus. */
    blur: (_event?: FocusEvent) => true,
    /** Input received focus. */
    focus: (_event?: FocusEvent) => true,
    /** Key pressed while the input is focused. */
    keydown: (_event?: KeyboardEvent) => true,
    /** Clear button clicked (single mode only). */
    clear: (_event?: MouseEvent) => true,
    /** Dropdown opened or closed. */
    open: (_isOpen: boolean) => true,
};
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * SelectTextField emits (adapting to the selection type).
 */
type SelectTextFieldEmits<O, S extends 'single' | 'multiple'> = Omit<EmitsOf<typeof emitSchema>, 'change'> & {
    change: (newValue: (S extends 'multiple' ? O[] : O) | undefined) => void;
};

type SingleSelectTextFieldPublicProps<O> = SingleSelectTextFieldProps<O> &
    EmitsToProps<SelectTextFieldEmits<O, 'single'>>;
type MultipleSelectTextFieldPublicProps<O> = MultipleSelectTextFieldProps<O> &
    EmitsToProps<SelectTextFieldEmits<O, 'multiple'>>;

/**
 * SelectTextField component constructor with generic type attached to props
 *
 * Vue's `defineComponent` setup-fn overload cannot carry an unbound generic from the setup
 * signature to the resulting component constructor, so the generic is layered on via cast.
 */
export interface SelectTextFieldConstructor {
    new <O = any>(
        props: SingleSelectTextFieldPublicProps<O> & PublicProps,
    ): {
        $props: SingleSelectTextFieldPublicProps<O>;
        $emit: EmitFn<SelectTextFieldEmits<O, 'single'>>;
    };
    new <O = any>(
        props: MultipleSelectTextFieldPublicProps<O> & PublicProps,
    ): {
        $props: MultipleSelectTextFieldPublicProps<O>;
        $emit: EmitFn<SelectTextFieldEmits<O, 'multiple'>>;
    };
}

/**
 * A text field with a select dropdown to choose between a list of options.
 * Supports search/filter, single selection, and multiple selection with chips.
 *
 * Scoped slots:
 * - `option({ option, index })` — custom option rendering inside a `<Combobox.Option>`.
 * - `sectionTitle({ sectionId, options })` — custom section header rendering.
 * - `chip({ option, index })` — custom chip rendering (multiple selection only).
 */
const SelectTextField = defineComponent(
    (props: SelectTextFieldProps, { emit, slots, attrs }) => {
        const isMultiple = computed(() => props.selectionType === 'multiple');

        // Merge `class` prop with `className` attr (React-style attr from core JSX).
        const className = useClassName(() => props.class);

        /*
         * Resolve disabled state from props and any React-named attrs (`ariaDisabled`,
         * `aria-disabled`) forwarded by the core JSX layer. `useDisableStateProps`
         * normalizes all the variants and provides `isAnyDisabled`.
         */
        const { isAnyDisabled, disabledStateProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs }) as Record<string, unknown>),
        );

        // Track whether the user is actively typing a search.
        const isSearching = ref(Boolean(props.searchInputValue));
        const searchText = ref(props.searchInputValue ?? '');

        // ComboboxList is a Vue component, so the ref resolves to its instance — Vue 3 auto-sets
        // `$el` to the root DOM node (the `<ul>`).
        const listRef = ref<ComponentPublicInstance | null>(null);

        // Ref to the underlying <input> element (needed to link the SelectionChipGroup)
        const inputElRef = ref<HTMLInputElement | null>(null);

        // Sync external controlled search value into internal state.
        watch(
            () => props.searchInputValue,
            (newVal) => {
                if (newVal !== undefined) {
                    searchText.value = newVal;
                    isSearching.value = Boolean(newVal);
                }
            },
        );

        // The display value shown in the input.
        const displayValue = computed(() => {
            // Guard: multiple mode always shows the search text (chips represent the selection).
            if (props.selectionType === 'multiple') return searchText.value;
            // Guard: while typing, always show what the user typed.
            if (isSearching.value) return searchText.value;
            // TypeScript now narrows props to SingleSelectTextFieldProps here.
            return getOptionDisplayName(props.value, props.getOptionName, props.getOptionId);
        });

        // Map option id selection to option object(s) selection (delegates the toggle math to core).
        const handleSelect = (selectedOption: { value: string }) => {
            const next = toggleSelection(
                props.options,
                props.getOptionId,
                props.value,
                selectedOption.value,
                props.selectionType === 'multiple',
            );
            // In multi mode, `toggleSelection` skips when no option matches and returns the
            // unchanged current array — the emit is a no-op for the consumer.
            emit('change', next);

            // Reset search state after selection.
            isSearching.value = false;
            searchText.value = '';
            emit('search', '');
        };

        // Handle text input changes (search).
        const handleInputChange = (inputValue: string) => {
            isSearching.value = true;
            searchText.value = inputValue;
            emit('search', inputValue);

            // When the user clears the input (single mode only), clear the selection too.
            if (!isMultiple.value && inputValue === '' && props.value !== undefined && props.value !== null) {
                emit('change', undefined);
            }
        };

        // Handle clear button click (single mode only).
        const handleClear = (event?: MouseEvent) => {
            emit('change', undefined);
            isSearching.value = false;
            searchText.value = '';
            emit('search', '');
            emit('clear', event);
        };

        // Handle blur: reset input to selected value name, then emit blur and search events.
        const handleBlur = (event?: FocusEvent) => {
            isSearching.value = false;
            searchText.value = '';
            emit('search', '');
            emit('blur', event);
        };

        /** Adapt the scoped slots to the JSX render functions expected by the core template. */
        const wrappedRenderOption = useWrappedRenderOptionSlot(slots.option);
        const wrappedRenderSectionTitle = useWrappedRenderSectionTitleSlot(slots.sectionTitle);

        /*
         * Check if a 'load-more' listener is registered on this component
         * (EmitsToProps mapping for the 'load-more' event produces 'onLoad-more').
         */
        const hasLoadMoreListener = useHasEventListener('onLoadMore') || useHasEventListener('onLoad-more');

        const onLoadMore = () => emit('load-more');

        return () => {
            const showClear =
                !isMultiple.value &&
                !isAnyDisabled.value &&
                (props.hasClearButton ?? true) &&
                props.value !== undefined &&
                props.value !== null;

            // TypeScript narrows props to MultipleSelectTextFieldProps inside the truthy branch.
            const chips =
                props.selectionType === 'multiple' ? (
                    <SelectionChipGroup
                        value={props.value}
                        theme={props.theme}
                        getOptionId={props.getOptionId}
                        getOptionName={props.getOptionName}
                        onChange={(newValue) => emit('change', newValue)}
                        inputRef={inputElRef.value}
                        isDisabled={isAnyDisabled.value}
                        label={props.translations.chipGroupLabel ?? props.label}
                        chipRemoveLabel={props.translations.chipRemoveLabel}
                    >
                        {{ chip: slots.chip || undefined }}
                    </SelectionChipGroup>
                ) : undefined;

            const listStatus = props.listStatus ?? 'idle';

            const beforeOptionsSlot = (props.beforeOptions ?? slots.beforeOptions?.()) as JSXElement | undefined;

            /*
             * Selector<O> is not assignable to Selector<any> due to function parameter contravariance.
             * The core template is not generic, so we cast selectors when forwarding to UI().
             */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return UI(
                {
                    options: props.options,
                    getOptionId: props.getOptionId as any,
                    getOptionName: props.getOptionName as any,
                    getOptionDescription: props.getOptionDescription as any,
                    renderOption: wrappedRenderOption.value as any,
                    getSectionId: props.getSectionId as any,
                    renderSectionTitle: wrappedRenderSectionTitle.value as any,
                    selected: props.value,
                    label: props.label,
                    isMultiselectable: isMultiple.value,
                    listStatus,
                    onOpen: (isOpen: boolean) => emit('open', isOpen),
                    loadingMessage: props.translations.loadingMessage,
                    emptyMessage: props.translations.emptyMessage,
                    nbOptionMessage: props.translations.nbOptionMessage,
                    errorMessage: props.translations.errorMessage,
                    errorTryReloadMessage: props.translations.errorTryReloadMessage,
                    inputProps: {
                        ...props.inputProps,
                        placeholder: props.placeholder,
                        icon: props.icon,
                        value: displayValue.value,
                        inputRef(el: HTMLInputElement | null) {
                            inputElRef.value = el;
                        },
                        onChange: handleInputChange,
                        onSelect: handleSelect,
                        onBlur: handleBlur,
                        onFocus: (event?: FocusEvent) => emit('focus', event),
                        onKeyDown: (event?: KeyboardEvent) => emit('keydown', event),
                        ...disabledStateProps.value,
                        isRequired: props.isRequired,
                        hasError: props.hasError,
                        error: props.error,
                        helper: props.helper,
                        id: props.id,
                        name: props.name,
                        isValid: props.isValid,
                        maxLength: props.maxLength,
                        'aria-label': props.ariaLabel,
                        clearButtonProps: showClear ? { label: props.translations.clearLabel } : undefined,
                        onClear: handleClear,
                        toggleButtonProps: props.translations.showSuggestionsLabel
                            ? { label: props.translations.showSuggestionsLabel }
                            : undefined,
                        filter: props.filter,
                        openOnFocus: props.openOnFocus,
                        className: className.value,
                        theme: props.theme,
                    },
                    popoverProps: props.popoverProps,
                    listProps: { ref: listRef },
                    chips: chips as JSXElement | undefined,
                    beforeOptions: beforeOptionsSlot,
                    onLoadMore: hasLoadMoreListener ? onLoadMore : undefined,
                    infiniteScrollOptions: { root: listRef.value?.$el ?? null, rootMargin: '100px' },
                },
                { Combobox, InfiniteScroll },
            );
        };
    },
    {
        name: 'LumxSelectTextField',
        inheritAttrs: false,
        props: keysOf<SelectTextFieldProps<unknown>>()(
            'options',
            'getOptionId',
            'getOptionName',
            'getOptionDescription',
            'getSectionId',
            'selectionType',
            'value',
            'filter',
            'searchInputValue',
            'hasClearButton',
            'listStatus',
            'label',
            'placeholder',
            'icon',
            'isDisabled',
            'aria-disabled',
            'isRequired',
            'hasError',
            'error',
            'helper',
            'id',
            'name',
            'isValid',
            'maxLength',
            'ariaLabel',
            'inputProps',
            'popoverProps',
            'translations',
            'beforeOptions',
            'openOnFocus',
            'class',
            'theme',
        ),
        emits: emitSchema,
    },
);

export default SelectTextField as unknown as SelectTextFieldConstructor & typeof SelectTextField;
