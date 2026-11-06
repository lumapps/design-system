import type { Size } from '../../constants';
import type { CommonRef, HasAriaLabelOrLabelledBy, HasClassName, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { resolveCssSize } from '../../utils/browser/css/resolveCssSize';
import { renderSelectOptions } from '../../utils/select/renderSelectOptions';
import type { BaseSelectProps, SelectListTranslations, SelectListStatus } from '../../utils/select/types';

/**
 * Width of the SelectList: a t-shirt size token (`m`, `l`, `xl`, `xxl`) or a percentage of the parent width.
 */
export type SelectListWidth = Extract<Size, 'm' | 'l' | 'xl' | 'xxl'> | `${number}%`;

/**
 * Props for the core SelectList template, without the accessible name props.
 */
export interface SelectListBaseProps<O> extends BaseSelectProps<O>, HasClassName {
    /**
     * Selected value (single mode) or selected values (multi mode).
     * The wrapper layer chooses the shape; the core just marks the selected options.
     */
    value?: O | O[];
    /** Single or multiple selection. */
    selectionType?: 'single' | 'multiple';
    /** Width of the list (t-shirt size token or percentage of the parent width). */
    width?: SelectListWidth;
    /** Minimum width of the list (t-shirt size token or percentage of the parent width). */
    minWidth?: SelectListWidth;
    /** Inline style of the root element. */
    style?: Record<string, any>;
    /** Props forwarded to the listbox element (e.g. ref). */
    listProps?: Record<string, any>;
    /** Callback on option selected (receives option id string). */
    handleSelect?: (selectedOption: { value: string }) => void;
    /**
     * Status of the list.
     * - `'idle'` — Default state, no loading indicators.
     * - `'loading'` — Full loading: shows skeleton placeholders, hides real options.
     * - `'loadingMore'` — Paginated loading: appends a skeleton after existing options.
     * - `'error'` — Error state: shows an error message.
     * @default 'idle'
     */
    listStatus?: SelectListStatus;
    /** Optional translations for screen-reader announcements (loading/empty/error/option count). */
    translations?: SelectListTranslations;
    /**
     * Callback fired to load more items (infinite scroll).
     * When provided together with an injected `InfiniteScroll` component, an invisible
     * sentinel element is rendered after the options to trigger loading via IntersectionObserver.
     */
    onLoadMore?: () => void;
    /** IntersectionObserver options forwarded to the InfiniteScroll sentinel. */
    infiniteScrollOptions?: IntersectionObserverInit;
    /** Reference to the root element. */
    ref?: CommonRef;
}

/**
 * Defines the props for the core SelectList template.
 * The listbox requires an accessible name (`aria-label` or `aria-labelledby`).
 */
export type SelectListProps<O> = SelectListBaseProps<O> & HasAriaLabelOrLabelledBy;

/**
 * Injected framework-specific components for SelectList rendering.
 */
export interface SelectListComponents {
    /** Internal listbox components (standalone listbox provider, list, options, state). */
    Listbox: {
        Provider: any;
        List: any;
        Option: any;
        Section: any;
        OptionSkeleton: any;
        SelectionIcon: any;
        State: any;
    };
    /** Framework-specific InfiniteScroll component (handles IntersectionObserver lifecycle). */
    InfiniteScroll?: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'SelectList';

/**
 * Component default class name.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-select-list';

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {
    selectionType: 'single',
} as const;

/**
 * SelectList core template.
 * Renders a standalone listbox (always visible) with a list of options and a live region for the list states.
 *
 * Framework-specific components are passed as a second argument by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const SelectList = <O,>(props: SelectListProps<O>, { Listbox, InfiniteScroll }: SelectListComponents) => {
    const {
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        getSectionId,
        renderSectionTitle,
        value,
        selectionType = DEFAULT_PROPS.selectionType,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        width,
        minWidth,
        style,
        listProps,
        handleSelect,
        listStatus = 'idle',
        translations,
        onLoadMore,
        infiniteScrollOptions,
        className,
        ref,
        ...forwardedProps
    } = props;

    const isFullLoading = listStatus === 'loading';
    const isLoadingMore = listStatus === 'loadingMore';
    const isError = listStatus === 'error';
    const isMultiselectable = selectionType === 'multiple';
    // Prevent firing during loading or error states to avoid duplicate fetches.
    const isInfiniteScrollEnabled = listStatus === 'idle';
    const rootStyle = {
        ...style,
        ...(minWidth && { minWidth: resolveCssSize(minWidth) }),
        ...(width && { width: resolveCssSize(width) }),
    };

    return (
        <div ref={ref} {...forwardedProps} style={rootStyle} className={classNames.join(className, CLASSNAME)}>
            <Listbox.Provider onSelect={handleSelect}>
                <Listbox.List
                    {...listProps}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    aria-multiselectable={isMultiselectable || undefined}
                >
                    {isFullLoading ? (
                        <Listbox.OptionSkeleton count={3} />
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
                                selected: value,
                            },
                            {
                                Combobox: {
                                    Section: Listbox.Section,
                                    Option: Listbox.Option,
                                    SelectionIcon: Listbox.SelectionIcon,
                                },
                            },
                        )
                    )}
                    {onLoadMore && InfiniteScroll && (
                        <InfiniteScroll
                            callback={isInfiniteScrollEnabled ? onLoadMore : undefined}
                            options={infiniteScrollOptions}
                        />
                    )}
                    {isLoadingMore && <Listbox.OptionSkeleton count={1} />}
                </Listbox.List>
                <Listbox.State
                    loadingMessage={translations?.loadingMessage}
                    emptyMessage={translations?.emptyMessage}
                    nbOptionMessage={translations?.nbOptionMessage}
                    errorMessage={isError ? translations?.errorMessage : undefined}
                    errorTryReloadMessage={isError ? translations?.errorTryReloadMessage : undefined}
                />
            </Listbox.Provider>
        </div>
    );
};

SelectList.displayName = COMPONENT_NAME;
SelectList.className = CLASSNAME;
