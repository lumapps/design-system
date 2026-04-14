import { computed, defineComponent, ref, watch } from 'vue';

import { getWithSelector } from '@lumx/core/js/utils/selectors';
import { type RenderOptionContext, type BaseSelectTextFieldWrapperProps } from '@lumx/core/js/utils/select/types';
import { getOptionDisplayName } from '@lumx/core/js/utils/select/getOptionDisplayName';
import { SelectTextField as UI } from '@lumx/core/js/components/SelectTextField';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf } from '../../utils/VueToJSX';
import { Combobox } from '../combobox';
import ComboboxOption from '../combobox/ComboboxOption';
import SelectionChipGroup from '../chip/SelectionChipGroup';
import { InfiniteScroll } from '@lumx/vue/utils/InfiniteScroll';
import { useHasEventListener } from '../../composables/useHasEventListener';

/** Props shared across single and multiple selection modes. */
interface BaseSelectTextFieldProps<O = any> extends BaseSelectTextFieldWrapperProps<O> {
    /** Content to render before the options list. */
    beforeOptions?: any;
    /** CSS class. */
    class?: string;
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
 * Internal flattened type for `keysOf` — Vue's runtime prop system needs all keys
 * enumerated in a single interface (it cannot narrow on discriminated unions).
 */
type AllSelectTextFieldPropsKeys = BaseSelectTextFieldProps & {
    selectionType: 'single' | 'multiple';
    value?: any;
};

export const emitSchema = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_newValue?: any) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    search: (_searchText: string) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'load-more': () => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blur: (_event?: FocusEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    focus: (_event?: FocusEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keydown: (_event?: KeyboardEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clear: (_event?: MouseEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open: (_isOpen: boolean) => true,
};

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

        // Resolve aria-disabled from props or attrs.
        // Vue normalizes kebab-case props to camelCase, so check both forms.
        const ariaDisabled = computed(
            () =>
                props['aria-disabled'] ??
                (props as any).ariaDisabled ??
                (attrs as any).ariaDisabled ??
                (attrs as any)['aria-disabled'],
        );

        // Compute whether the component is disabled (native or aria-disabled).
        const isAnyDisabled = computed(() => {
            return !!props.isDisabled || ariaDisabled.value === true || ariaDisabled.value === 'true';
        });

        // Track whether the user is actively typing a search.
        const isSearching = ref(Boolean(props.searchInputValue));
        const searchText = ref(props.searchInputValue ?? '');

        const listElement = ref<HTMLElement | null>(null);

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
            if (isMultiple.value || isSearching.value) {
                return searchText.value;
            }
            return getOptionDisplayName(props.value as any, props.getOptionName, props.getOptionId);
        });

        // Map option id selection to option object selection.
        const handleSelect = (selectedOption: { value: string }) => {
            const selectedValue = selectedOption.value;
            const newOption =
                selectedValue &&
                props.options?.find((option) => getWithSelector(props.getOptionId, option) === selectedValue);

            if (!isMultiple.value) {
                emit('change', newOption);
            } else {
                const currentValue = (props.value as any[]) || [];
                const existingIndex = currentValue.findIndex(
                    (item) => getWithSelector(props.getOptionId, item) === selectedValue,
                );

                if (existingIndex === -1) {
                    // Skip if no matching option found (e.g. beforeOptions custom actions).
                    if (newOption) {
                        emit('change', [...currentValue, newOption]);
                    }
                } else {
                    // Remove option (toggle off)
                    const updated = [...currentValue];
                    updated.splice(existingIndex, 1);
                    emit('change', updated);
                }
            }

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

        // Wrap the consumer's renderOption slot.
        // The scoped slot receives `{ option, index }` and should return
        // content to display inside a <Combobox.Option>.
        const wrappedRenderOption = computed(() => {
            const renderOptionSlot = slots.option;
            if (!renderOptionSlot) return undefined;

            return (option: any, { index, value: optionValue, isSelected, description }: RenderOptionContext) => {
                // TODO: override props and not just content
                const slotContent = renderOptionSlot({ option, index });

                // The slot content is wrapped in a Combobox.Option with
                // core-computed props (value, isSelected, description, key)
                return (
                    <ComboboxOption
                        key={optionValue}
                        value={optionValue}
                        isSelected={isSelected}
                        description={description ?? undefined}
                    >
                        {slotContent}
                    </ComboboxOption>
                ) as any;
            };
        });

        // Wrap the consumer's renderSectionTitle slot.
        // The scoped slot receives `{ sectionId, options }` and should return
        // custom JSX to display as the section title.
        const wrappedRenderSectionTitle = computed(() => {
            const renderSectionTitleSlot = slots.sectionTitle;
            if (!renderSectionTitleSlot) return undefined;

            return (sectionId: string, options: any[]) => {
                return renderSectionTitleSlot({ sectionId, options }) as any;
            };
        });

        // Check if a 'load-more' listener is registered on this component.
        // Uses vnode.props instead of $attrs because Vue 3 removes declared emits from $attrs.
        const hasLoadMoreListener = useHasEventListener('onLoad-more') || useHasEventListener('onLoadMore');

        const onLoadMore = () => emit('load-more');

        return () => {
            const showClear =
                !isMultiple.value &&
                !isAnyDisabled.value &&
                (props.hasClearButton ?? true) &&
                props.value !== undefined &&
                props.value !== null;

            const chips = isMultiple.value ? (
                <SelectionChipGroup
                    value={props.value as any[] | undefined}
                    theme={props.theme}
                    getOptionId={props.getOptionId}
                    getOptionName={props.getOptionName}
                    onChange={(newValue: any) => emit('change', newValue)}
                    isDisabled={isAnyDisabled.value}
                    label={props.translations.chipGroupLabel ?? props.label}
                    chipRemoveLabel={props.translations.chipRemoveLabel}
                >
                    {{ chip: slots.chip || undefined }}
                </SelectionChipGroup>
            ) : undefined;

            const listStatus = props.listStatus ?? 'idle';

            const beforeOptionsSlot = (props.beforeOptions ?? slots.beforeOptions?.()) as JSXElement | undefined;

            // Selector<O> is not assignable to Selector<any> due to function parameter contravariance.
            // The core template is not generic, so we cast selectors when forwarding to UI().
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
                        onChange: handleInputChange,
                        onSelect: handleSelect,
                        onBlur: handleBlur,
                        onFocus: (event?: FocusEvent) => emit('focus', event),
                        onKeyDown: (event?: KeyboardEvent) => emit('keydown', event),
                        isDisabled: props.isDisabled,
                        'aria-disabled': ariaDisabled.value,
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
                        className: props.class,
                        theme: props.theme,
                    },
                    popoverProps: props.popoverProps,
                    listProps: {
                        ref: (el: any) => {
                            listElement.value = el?.$el || el;
                        },
                    },
                    chips: chips as any,
                    beforeOptions: beforeOptionsSlot as any,
                    onLoadMore: hasLoadMoreListener ? onLoadMore : undefined,
                    infiniteScrollOptions: { root: listElement.value, rootMargin: '100px' },
                },
                { Combobox, InfiniteScroll },
            );
        };
    },
    {
        name: 'LumxSelectTextField',
        inheritAttrs: false,
        props: keysOf<AllSelectTextFieldPropsKeys>()(
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
            'className',
            'theme',
        ),
        emits: emitSchema,
    },
);

export default SelectTextField;
