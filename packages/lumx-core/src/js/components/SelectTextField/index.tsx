import type { JSXElement, LumxClassName } from '../../types';
import { renderSelectOptions } from '../../utils/select/renderSelectOptions';
import { BaseSelectComponents, BaseSelectProps, SelectTextFieldStatus } from '../../utils/select/types';

/**
 * Defines the props for the core SelectTextField template.
 */
export interface SelectTextFieldProps<O = any> extends BaseSelectProps<O> {
    /** Selected option (single) or options (multiple) — for marking options as selected. */
    selected?: O | O[];

    /** Field label (required). Also used as aria-label for the listbox. */
    label: string;

    /** Whether the listbox supports multiple selection. */
    isMultiselectable?: boolean;

    /** Props forwarded to Combobox.Input. */
    inputProps?: Record<string, any>;

    /** Props forwarded to Combobox.Popover. */
    popoverProps?: Record<string, any>;

    /** Props forwarded to Combobox.List (e.g. ref). */
    listProps?: Record<string, any>;

    /**
     * Status of the dropdown list.
     * - `'idle'` — Default state, no loading indicators.
     * - `'loading'` — Full loading: shows skeleton placeholders, hides real options.
     * - `'loadingMore'` — Paginated loading: appends a skeleton after existing options.
     * - `'error'` — Error state: shows an error message in the dropdown.
     * @default 'idle'
     */
    listStatus?: SelectTextFieldStatus;

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
     * Displayed when the combobox is open, not empty, not loading, and not in error.
     * When omitted, no option count message is shown.
     */
    nbOptionMessage?: (optionsLength: number) => string;

    /** Error title displayed in the dropdown (e.g. "Failed to load"). */
    errorMessage?: string;

    /** Secondary error message (e.g. "Please try again"). */
    errorTryReloadMessage?: string;

    /** Callback fired when the dropdown open state changes. */
    onOpen?: (isOpen: boolean) => void;

    /** Chips element rendered inside the input (multiple selection). */
    chips?: JSXElement;

    /** Content to render before the options list. */
    beforeOptions?: JSXElement;

    /** Content to render after options. */
    afterOptions?: JSXElement;

    /**
     * Callback fired to load more items (infinite scroll).
     * When provided together with an injected `InfiniteScroll` component, an invisible
     * sentinel element is rendered after the options to trigger loading via IntersectionObserver.
     */
    onLoadMore?: () => void;

    /** IntersectionObserver options forwarded to the InfiniteScroll sentinel. */
    infiniteScrollOptions?: IntersectionObserverInit;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'SelectTextField';

/**
 * Component default class name.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-select-text-field';

/**
 * SelectTextField core template.
 * Renders a Combobox with a text input trigger and a dropdown list of options.
 * Supports search/filter, single selection, and multiple selection with chips.
 *
 * Framework-specific components are passed as a second argument by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const SelectTextField = (props: SelectTextFieldProps, { Combobox, InfiniteScroll }: BaseSelectComponents) => {
    const {
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        getSectionId,
        renderSectionTitle,
        selected,
        label,
        isMultiselectable,
        inputProps,
        popoverProps,
        listProps,
        listStatus = 'idle',
        loadingMessage,
        emptyMessage,
        nbOptionMessage,
        errorMessage,
        errorTryReloadMessage,
        onOpen,
        chips,
        beforeOptions,
        afterOptions,
        onLoadMore,
        infiniteScrollOptions,
    } = props;

    const isFullLoading = listStatus === 'loading';
    const isLoadingMore = listStatus === 'loadingMore';
    const isError = listStatus === 'error';

    return (
        <Combobox.Provider onOpen={onOpen}>
            <Combobox.Input label={label} {...inputProps} chips={chips} />

            <Combobox.Popover
                fitToAnchorWidth="minWidth"
                fitWithinViewportHeight
                placement="bottom-start"
                {...popoverProps}
            >
                <Combobox.List {...listProps} aria-label={label} aria-multiselectable={isMultiselectable || undefined}>
                    {beforeOptions}

                    {isFullLoading ? (
                        <Combobox.OptionSkeleton count={3} />
                    ) : (
                        renderSelectOptions(
                            {
                                options,
                                getOptionId,
                                getOptionName,
                                getOptionDescription,
                                renderOption,
                                getSectionId,
                                renderSectionTitle,
                                selected,
                            },
                            { Combobox },
                        )
                    )}

                    {afterOptions}

                    {onLoadMore && InfiniteScroll && (
                        <InfiniteScroll
                            callback={() => {
                                // Guard: prevent firing during loading or error states to avoid duplicate fetches.
                                if (listStatus && listStatus !== 'idle') return;
                                onLoadMore();
                            }}
                            options={infiniteScrollOptions}
                        />
                    )}

                    {isLoadingMore && <Combobox.OptionSkeleton count={1} />}
                </Combobox.List>

                <Combobox.State
                    loadingMessage={loadingMessage}
                    emptyMessage={emptyMessage}
                    nbOptionMessage={nbOptionMessage}
                    errorMessage={isError ? errorMessage : undefined}
                    errorTryReloadMessage={isError ? errorTryReloadMessage : undefined}
                />
            </Combobox.Popover>
        </Combobox.Provider>
    );
};

SelectTextField.displayName = COMPONENT_NAME;
SelectTextField.className = CLASSNAME;
