import type { HasAriaDisabled } from '../../types/HasAriaDisabled';
import type { HasTheme } from '../../types/HasTheme';
import type { JSXElement, Selector } from '../../types';

/**
 * Status of the SelectTextField dropdown list.
 *
 * - `'idle'` — Default state, no loading indicators.
 * - `'loading'` — Full loading: shows skeleton placeholders, hides real options.
 * - `'loadingMore'` — Paginated loading: appends a skeleton after existing options.
 * - `'error'` — Error state: shows an error message in the dropdown.
 */
export type SelectTextFieldStatus = 'idle' | 'loading' | 'loadingMore' | 'error';

/**
 * Context passed to the `renderOption` callback alongside the option object.
 * Contains core-computed values that the consumer should forward to `<Combobox.Option>`.
 */
export interface RenderOptionContext {
    /** Index of the option in the current (possibly section-filtered) list. */
    index: number;
    /** Resolved option id (from `getOptionId`). Should be passed as `value` to `<Combobox.Option>`. */
    value: any;
    /** Whether this option is currently selected. Should be forwarded as `isSelected`. */
    isSelected: boolean;
    /** Resolved description string (from `getOptionDescription`), if any. Should be forwarded as `description`. */
    description?: string | null;
}

export interface BaseSelectProps<O> {
    /** List of option objects. */
    options?: Array<O>;
    /** Option object id selector. */
    getOptionId: Selector<O>;
    /** Option object name selector (falls back to id if not defined). */
    getOptionName?: Selector<O, string | undefined | null>;
    /** Option object description selector. */
    getOptionDescription?: Selector<O, string | undefined | null>;
    /**
     * Custom option render function (core/Vue contract).
     * Receives the option object and a `RenderOptionContext` with core-computed props (`value`,
     * `isSelected`, `description`, `index`). The callee must render a `<Combobox.Option>` and
     * forward those context values, including a unique `key`.
     *
     * @example (Vue / core level)
     * renderOption={(fruit, { value, isSelected, description }) => (
     *     <Combobox.Option key={value} value={value} isSelected={isSelected} description={description}>
     *         <strong>{fruit.name}</strong>
     *     </Combobox.Option>
     * )}
     */
    renderOption?: (option: O, context: RenderOptionContext) => JSXElement;
    /**
     * Selector returning a section id string for each option. Options with the same
     * section id are grouped together. The id is also used as the default displayed
     * label unless `renderSectionTitle` is provided.
     */
    getSectionId?: Selector<O, string>;
    /**
     * Custom section title render function. Receives the section id and the options
     * in that section. Returns custom JSX to display as the section header.
     * When not provided, the section id is used as a plain text label.
     */
    renderSectionTitle?: (sectionId: string, options: O[]) => JSXElement;
}

export interface BaseSelectComponents {
    /** Combobox compound component. */
    Combobox: {
        Provider: any;
        Button: any;
        Input: any;
        Popover: any;
        List: any;
        Section: any;
        Option: any;
        State: any;
        OptionSkeleton: any;
    };
    /** Framework-specific InfiniteScroll component (handles IntersectionObserver lifecycle). */
    InfiniteScroll?: any;
}

/**
 * Props for rendering select options.
 */
export interface RenderSelectOptionsProps<O> extends BaseSelectProps<O> {
    /** Selected option (single) or options (multiple). */
    selected?: O | O[];
}

/**
 * Shared translation labels for SelectTextField wrappers (React and Vue).
 */
export interface SelectTextFieldTranslations {
    /** Accessible label for the clear button. */
    clearLabel?: string;
    /** Accessible label for the show-suggestions toggle button. When omitted, the toggle button is not rendered. */
    showSuggestionsLabel?: string;
    /** Accessible label for the chip group. */
    chipGroupLabel?: string;
    /** Accessible label for the remove action on chips (used in visually hidden text). */
    chipRemoveLabel?: string;
    /** Screen reader loading announcement (e.g. "Loading…"). */
    loadingMessage?: string;
    /**
     * Message to display when the list has no visible options.
     * Can be a plain string or a function receiving the current input value (for dynamic messages).
     * When omitted, the empty state is not shown.
     */
    emptyMessage?: string | ((inputValue: string) => string);
    /**
     * Message callback to display the number of available options.
     * Called with the current visible option count and should return a human-readable string
     * (e.g. `(n) => \`${n} result(s) available\``).
     * Displayed when the combobox is open, not empty, not loading, and not in error.
     * When omitted, no option count message is shown.
     */
    nbOptionMessage?: (optionsLength: number) => string;
    /** Error title displayed in the dropdown (e.g. "Failed to load"). */
    errorMessage?: string;
    /** Secondary error message (e.g. "Please try again"). */
    errorTryReloadMessage?: string;
}

/**
 * Shared translation labels for SelectButton wrappers (React and Vue).
 */
export interface SelectButtonTranslations {
    /** Screen reader loading announcement (e.g. "Loading…"). */
    loadingMessage?: string;
    /**
     * Message to display when the list has no visible options.
     * Can be a plain string or a function receiving the current input value (for dynamic messages).
     * When omitted, the empty state is not shown.
     */
    emptyMessage?: string | ((inputValue: string) => string);
    /**
     * Message callback to display the number of available options.
     * Called with the current visible option count and should return a human-readable string.
     * Displayed when the dropdown is open, not empty, not loading, and not in error.
     * When omitted, no option count message is shown.
     */
    nbOptionMessage?: (optionsLength: number) => string;
    /** Error title displayed in the dropdown (e.g. "Failed to load"). */
    errorMessage?: string;
    /** Secondary error message (e.g. "Please try again"). */
    errorTryReloadMessage?: string;
}

/**
 * Wrapper-level props shared between React and Vue SelectButton implementations.
 * These are framework-specific concerns (not part of the core template) that both
 * wrappers need — extracted here to avoid duplication.
 */
export interface BaseSelectButtonWrapperProps<O>
    extends Pick<
        BaseSelectProps<O>,
        'options' | 'getOptionId' | 'getOptionName' | 'getOptionDescription' | 'getSectionId'
    > {
    /** Selected value. */
    value?: O;
    /** Button label (used for ARIA and when no selection). */
    label: string;
    /**
     * Status of the dropdown list.
     * @default 'idle'
     */
    listStatus?: SelectTextFieldStatus;
    /** Optional translations for screen-reader announcements (loading/empty/error/option count). */
    translations?: SelectButtonTranslations;
}

/**
 * Wrapper-level props shared between React and Vue SelectTextField implementations.
 * These are framework-specific concerns (not part of the core template) that both
 * wrappers need — extracted here to avoid duplication.
 */
export interface BaseSelectTextFieldWrapperProps<O>
    extends Pick<
            BaseSelectProps<O>,
            'options' | 'getOptionId' | 'getOptionName' | 'getOptionDescription' | 'getSectionId'
        >,
        HasAriaDisabled,
        HasTheme {
    /** Selection type: 'single' or 'multiple'. */
    selectionType: 'single' | 'multiple';
    /**
     * Status of the dropdown list.
     * @default 'idle'
     */
    listStatus?: SelectTextFieldStatus;
    /**
     * Controls how the combobox filters options as the user types.
     *
     * - `'auto'` — Options that do not match the input value are hidden client-side.
     * - `'manual'` — All options remain visible; filtering is the consumer's
     *   responsibility (e.g. by updating the `options` prop in response to `onSearch`).
     * - `'off'` — Like `'manual'`, but the input is also set to `readOnly` and
     *   `openOnFocus` defaults to `true` (useful for static dropdowns / pure pickers).
     *
     * This prop is independent of `onSearch`: you can use both together (e.g. client-side
     * filtering + tracking search text for a "create" action), or use `filter: 'manual'`
     * without `onSearch` for static dropdowns.
     */
    filter: 'auto' | 'manual' | 'off';
    /**
     * Controlled search input value.
     * When provided, this value seeds (and resets) the visible search text in the input.
     * Setting it to `''` (empty string) resets the input.
     */
    searchInputValue?: string;
    /**
     * Whether to show a clear button when a value is selected.
     * @default true
     */
    hasClearButton?: boolean;
    /**
     * When true, the dropdown opens automatically when the input receives focus.
     * When false (default), the dropdown only opens on click, typing, or keyboard navigation.
     *
     * @default false
     */
    openOnFocus?: boolean;
    /** Field label (required). Also used as aria-label for the listbox. */
    label: string;
    /** Input placeholder text. */
    placeholder?: string;
    /** Leading icon (SVG path). */
    icon?: string;
    /** Disabled state. */
    isDisabled?: boolean;
    /** Required field indicator. */
    isRequired?: boolean;
    /** Error state flag. */
    hasError?: boolean;
    /** Error message text. */
    error?: string;
    /** Helper text below the field. */
    helper?: string;
    /** Native input id attribute. */
    id?: string;
    /** Native input name attribute. */
    name?: string;
    /** Whether displayed with valid style. */
    isValid?: boolean;
    /** Maximum string length (shows character counter). */
    maxLength?: number;
    /** Accessible label for the input element (overrides the visual label for screen readers). */
    ariaLabel?: string;
    /** Additional props forwarded to the Combobox.Input (and ultimately to TextField). */
    inputProps?: Record<string, any>;
    /** Props forwarded to the Combobox.Popover. */
    popoverProps?: Record<string, any>;
    /** Labels for the clear button, toggle button, and chip group. */
    translations: SelectTextFieldTranslations;
}
