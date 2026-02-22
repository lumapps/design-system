import type { LumxClassName } from '../../types';
import { getWithSelector } from '../../utils/selectors';
import { renderSelectOptions } from '../../utils/select/renderSelectOptions';
import type { ComboboxButtonLabelDisplayMode } from '../Combobox/ComboboxButton';
import {
    BaseSelectComponents,
    BaseSelectProps,
    SelectButtonTranslations,
    SelectTextFieldStatus,
} from '../../utils/select/types';

/**
 * Defines the props for the core SelectButton template.
 */
export interface SelectButtonProps<O> extends BaseSelectProps<O> {
    /** Selected value. */
    value?: O;
    /** Button label (used for ARIA and when no selection). */
    label: string;
    /** Controls how the label/value is displayed in the button. */
    labelDisplayMode?: ComboboxButtonLabelDisplayMode;
    /**
     * Props forwarded to Combobox.Button (button appearance, emphasis, size, etc.).
     * Pass `renderButton` here to provide a custom button renderer — see
     * `ComboboxButtonProps.renderButton`. Framework wrappers are responsible for
     * defaulting any visual affordance (e.g. the dropdown chevron `rightIcon`).
     */
    buttonProps?: Record<string, any>;
    /** Props forwarded to Combobox.Popover. */
    popoverProps?: Record<string, any>;
    /** Props forwarded to Combobox.List (e.g. ref). */
    listProps?: Record<string, any>;
    /** Callback on option selected (receives option id string). */
    handleSelect?: (selectedOption: { value: string }) => void;
    /**
     * Status of the dropdown list.
     * - `'idle'` — Default state, no loading indicators.
     * - `'loading'` — Full loading: shows skeleton placeholders, hides real options.
     * - `'loadingMore'` — Paginated loading: appends a skeleton after existing options.
     * - `'error'` — Error state: shows an error message in the dropdown.
     * @default 'idle'
     */
    listStatus?: SelectTextFieldStatus;
    /** Optional translations for screen-reader announcements (loading/empty/error/option count). */
    translations?: SelectButtonTranslations;
    /** Callback fired when the dropdown open state changes. */
    onOpen?: (isOpen: boolean) => void;
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
 * Injected framework-specific components for SelectButton rendering.
 */
export type SelectButtonComponents = BaseSelectComponents;

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'SelectButton';

/**
 * Component default class name.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-select-button';

/**
 * SelectButton core template.
 * Renders a Combobox with a button trigger and a dropdown list of options.
 *
 * Framework-specific components are passed as a second argument by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const SelectButton = <O,>(props: SelectButtonProps<O>, { Combobox, InfiniteScroll }: SelectButtonComponents) => {
    const {
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        getSectionId,
        renderSectionTitle,
        value,
        label,
        labelDisplayMode,
        buttonProps,
        popoverProps,
        listProps,
        handleSelect,
        listStatus = 'idle',
        translations,
        onOpen,
        onLoadMore,
        infiniteScrollOptions,
    } = props;

    const isFullLoading = listStatus === 'loading';
    const isLoadingMore = listStatus === 'loadingMore';
    const isError = listStatus === 'error';

    return (
        <Combobox.Provider onOpen={onOpen}>
            <Combobox.Button
                {...buttonProps}
                label={label}
                value={(value && getWithSelector(getOptionName, value)) || ''}
                onSelect={handleSelect}
                labelDisplayMode={labelDisplayMode}
            />

            <Combobox.Popover
                fitToAnchorWidth="minWidth"
                fitWithinViewportHeight
                placement="bottom-start"
                {...popoverProps}
            >
                <Combobox.List {...listProps} aria-label={label}>
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
                                selected: value,
                            },
                            { Combobox },
                        )
                    )}

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
                    loadingMessage={translations?.loadingMessage}
                    emptyMessage={translations?.emptyMessage}
                    nbOptionMessage={translations?.nbOptionMessage}
                    errorMessage={isError ? translations?.errorMessage : undefined}
                    errorTryReloadMessage={isError ? translations?.errorTryReloadMessage : undefined}
                />
            </Combobox.Popover>
        </Combobox.Provider>
    );
};

SelectButton.displayName = COMPONENT_NAME;
SelectButton.className = CLASSNAME;
