import { ReactNode, ReactText } from 'react';

import { ListItemSize, TextFieldProps, TooltipProps } from '@lumx/react';
import type { Selector } from '@lumx/core/js/types/Selector';

/**
 * The source of the combobox option selection
 * It could either be on click / touch or keyboard selection
 */
export type ComboboxOptionSelectEventSource = 'keyboard' | 'click';

export type ComboboxSelectionType = 'single' | 'multiple';

export type BaseLoadingStatus = 'loading' | 'loadingMore' | 'idle' | 'error' | 'debouncing' | 'filtering' | 'empty';

/**
 * Options related types
 */

/** All possible values a combobox option can have  */
export type BaseComboboxOptionProps<O = any> = {
    /**
     * A unique id to track the option
     */
    id: string;
    /**
     * Whether the current input value should filter this option.
     */
    filterFromInput?: boolean;
    /**
     * Callback to call when the option is selected.
     * This should only be used to add custom actions on options.
     * For most cases, the "onSelect" on the Combobox root component should be enough.
     */
    onSelect?: (option: O, eventSource?: ComboboxOptionSelectEventSource) => void;
    /**
     * Additional data to link to the option. This can be useful to retrieve with `onSelect`.
     */
    data?: O;
    /**
     * Whether the option is disabled
     */
    isDisabled?: boolean;
    /**
     * The components to use to visually customize options.
     * ! Options must not have interactive elements.
     * ! If you need additional actions, you might need to create custom options and search how to
     * ! make them accessible.
     */
    children?: ReactNode;
    /**
     * The text value the option has.
     * This is the value used to filter the options by when manual filtering is disabled
     * and that will be used as input value when an option is selected
     */
    textValue?: string;
    /**
     * Element to display before the content of the option.
     * ! Options must not have interactive elements.
     * ! If you need additional actions, you might need to create custom options and search how to
     * ! make them accessible.
     */
    before?: ReactNode;
    /**
     * Element to display after the content of the option.
     * ! Options must not have interactive elements.
     * ! If you need additional actions, you might need to create custom options and search how to
     * ! make them accessible.
     */
    after?: ReactNode;
    /**
     * Size of the list item.
     * Default to tiny
     */
    size?: ListItemSize;
    /**
     * Fill to activate a tooltip on mouse over
     */
    tooltipProps?: Partial<TooltipProps>;
};

/**
 * Props for when an option has no children.
 * In these case, we need at least the text value to know what to display
 * */
type TextValueOnly<O = any> = BaseComboboxOptionProps<O> & {
    children?: never;
    textValue: string;
};

/**
 * Props for when an option has a react element as string
 * In that case, we can use the children as the textValue without having
 * to set a manual props.
 * The props is still available to have a text value different than the displayed value.
 */
export type StringOption<O = any> = BaseComboboxOptionProps<O> & {
    children: ReactText;
    textValue?: string;
};

/**
 * Props for when an option has a react element as children
 * In that case, we cannot know what the actual value of the
 * option is, so the `textValue` prop has to be set.
 */
export type NodeOption<O = any> = BaseComboboxOptionProps<O> & {
    children: Exclude<ReactNode, ReactText>;
    textValue: string;
};

/** Props for the ComboboxOption component */
export type ComboboxOptionProps<O = any> = TextValueOnly<O> | StringOption<O> | NodeOption<O>;

/** Shared data between all combobox option types. */
export interface BaseRegisteredComboboxOption {
    id: string;
    /** The id that was generated for this option */
    generatedId: string;
    /** Whether the "option" is an action */
    isAction?: boolean;
    /** Whether the "option" is disabled */
    isDisabled?: boolean;
}

/** Values of action type options */
export interface RegisteredComboboxAction extends BaseRegisteredComboboxOption {
    /** Whether the "option" is an action */
    isAction: true;
    /** Callback when the action is triggered.  */
    onSelect?: () => void;
}

/** Combobox value */
export interface RegisteredComboboxOptionValue<O = any>
    extends BaseRegisteredComboboxOption,
        Pick<ComboboxOptionProps<O>, 'data' | 'filterFromInput' | 'textValue' | 'onSelect'> {
    /** The section the option is a child of. */
    sectionId?: string;
    /** Whether the "option" is an action */
    isAction?: never;
}

/** The option values stored in the state */
export type RegisteredComboboxOption<O = any> = RegisteredComboboxAction | RegisteredComboboxOptionValue<O>;

export type OnComboboxSelect<O = any> = (option: RegisteredComboboxOptionValue<O>) => void;
export type OnComboboxInputChange = TextFieldProps['onChange'];

export type ComboboxTranslations = {
    clearLabel: string;
    showSuggestionsLabel: string;
    loadingLabel: string;
    noResultsForInputLabel: (input?: string) => string;
    serviceUnavailableLabel: string;
    tryReloadLabel: string;
    nbOptionsLabel: (options: number) => string;
};

/** Props for the main combobox component. */
export type ComboboxProps<O = any> = {
    /**
     * HTML id
     */
    id?: string;
    /**
     * The current option id to set as selected.
     * If omitted, the local state will be used instead;
     */
    selectedIds?: Array<string | number>;
    /**
     * The current value for the combobox input.
     * If omitted, the input is controlled locally */
    inputValue?: string;
    /**
     * The default value to set on the input.
     * Use this if you want to initialize the input with a value and not control it
     */
    defaultInputValue?: string;
    /**
     * Whether the options should be automatically filtered or not.
     * By default, the combobox will try to filter the options from the current input value
     * using a "contains" strategy.
     * If this is `false`, the option will not be automatically filtered and must be manually filtered by the parent.
     * Useful for asynchronous comboboxes.
     */
    autoFilter: boolean;
    /**
     * Whether the combobox should open on focus
     */
    openOnFocus?: boolean;
    /**
     * Whether the combobox should open on click
     */
    openOnClick?: boolean;
    /**
     * Status of the combobox
     */
    status?: BaseLoadingStatus;
    /**
     * Callback when the input changes.
     */
    onInputChange?: OnComboboxInputChange;
    /**
     * Callback for when an option is selected
     */
    onSelect?: OnComboboxSelect<O>;
    /**
     * Callback called when the combobox opens
     */
    onOpen?: (options: { currentValue?: string; manual: boolean }) => void;
    /**
     * The combobox components to render.
     * Must be one of the exposed components (Combobox.Input, Combobox.ListBox etc...)
     */
    children: ReactNode;
    /**
     * The combobox can have a specific selection type:
     * - Single: only one item is selected
     * - Multiple: several items can be selected (this impacts the combobox list, which will now not close when selectiong an option)
     */
    selectionType?: ComboboxSelectionType;
    /**
     * Whether the error state should be displayed when the status is in error.
     * @default `true` if `status` is defined
     */
    showErrorState?: boolean;
    /**
     * Whether the empty state should be displayed when there is no results.
     * @default `true` if `autoFilter=false`
     */
    showEmptyState?: boolean;
    /** custom className */
    className?: string;
    /** translations to be used across the combobox */
    translations: ComboboxTranslations;
};

/** Entity related types for single selection. */
export type SingleSelection<O = any> = {
    selectionType: 'single';
    /**
     * Selected option object
     */
    value?: O;
    /**
     * Callback on option object selected
     */
    onChange?(newValue?: O): void;
    /**
     * No chips in single selection mode.
     */
    renderChip?: never;
};

/** Entity related types for multiple selection. */
export type MultipleSelection<O = any> = {
    selectionType: 'multiple';
    /**
     * Selected options array
     */
    value?: O[];
    /**
     * Callback on option array selected
     */
    onChange?(newValue?: O[]): void;
    /**
     * Custom selection chip render function
     */
    renderChip?: (option: O) => ReactNode;
};

/** Shared props between SelectTextField and SelectButton */
export type BaseSelectProps<O = any> = {
    /**
     * List of option objects
     */
    options?: Array<O>;
    /**
     * Option object id selector (either the property name or a function to get the id)
     */
    getOptionId: Selector<O>;
    /**
     * Option object name selector (either the property name or a function to get the name)
     * Fallbacks on the ID if not defined
     */
    getOptionName?: Selector<O, string | undefined | null>;
    /**
     * Option object description selector (either the property name or a function to get the description)
     */
    getOptionDescription?: Selector<O, string | undefined | null>;
    /**
     * Option object section id selector.
     * Providing this will group options by sections (and may change their order)
     * If the section id is a string, it is used as section label. Else, the section won't have a label.
     */
    getSectionId?: Selector<O, any>;
    /**
     * option object section title selector.
     * If provided, the section will be rendered using this function.
     */
    renderSectionTitle?: (option: O, sectionIndex: number) => React.ReactNode;
    /**
     * Whether the sections are separated by dividers
     */
    hasSectionDividers?: boolean;
    /**
     * Option object render function
     * Default to rendering option using the id & name obtained with `optionIdSelector` & `optionNameSelector`
     *
     * **The direct child must be a Combobox.Option, otherwise it will not render the children.**.
     */
    renderOption?: (option: O, index: number) => React.ReactNode;
    /**
     * Callback to load more items
     */
    onLoadMore?(): void;
    /**
     * Props passed to the option list.
     */
    // listProps?: Partial<ComboboxListBoxProps>;
    /**
     * Add custom elements before the options
     */
    beforeOptions?: ReactNode;
    /**
     * Data attribute scope
     */
    scope?: string;
};

/**
 * Combobox state management types
 */

export type ComboboxState = {
    /** Id of the combobox */
    comboboxId: string;
    /** Id of the listbox */
    listboxId: string;
    /** Current status of the combobox */
    status: BaseLoadingStatus;
    /**
     * Registered options dictionary.
     * This is useful to know how many options there are.
     */
    options: Record<string, RegisteredComboboxOption>;
    /** Whether the combobox is currently opened */
    isOpen: boolean;
    /** Whether all options should be displayed regardless of current value. */
    showAll: boolean;
    /** The current input value. */
    inputValue: string;
    /** The current option length */
    optionsLength: number;
    /**
     * Whether the combobox options should be managed as a listbox or a grid.
     * The options becomes a grid as soon as a secondary action is registered.
     */
    type: 'listbox' | 'grid';
    /** The default input value. */
    defaultInputValue?: string;
};

export type OpenComboboxAction = {
    type: 'OPEN_COMBOBOX';
    payload?: { manual?: boolean };
};

export type CloseComboboxAction = {
    type: 'CLOSE_COMBOBOX';
};

export type SetInputValueAction = {
    type: 'SET_INPUT_VALUE';
    payload: string;
};

export type AddOptionAction = {
    type: 'ADD_OPTION';
    payload: { id: string; option: RegisteredComboboxOption };
};

export type RemoveOptionAction = {
    type: 'REMOVE_OPTION';
    payload: { id: string };
};

export type ComboboxAction =
    | OpenComboboxAction
    | CloseComboboxAction
    | SetInputValueAction
    | AddOptionAction
    | RemoveOptionAction;

export type ComboboxReducer<A extends ComboboxAction> = (state: ComboboxState, action: A) => ComboboxState;
