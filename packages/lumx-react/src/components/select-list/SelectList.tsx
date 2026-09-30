import React, { type ForwardedRef, useCallback } from 'react';
import { toggleSelection } from '@lumx/core/js/utils/select/toggleSelection';
import type { GenericProps, HasAriaLabelOrLabelledBy, NamedProps } from '@lumx/core/js/types';
import {
    SelectList as UI,
    type SelectListBaseProps as UIProps,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/SelectList';
import { type SelectListTranslations, type SelectListStatus } from '@lumx/core/js/utils/select/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { Listbox } from '../listbox';
import { wrapRenderOption } from '../combobox/wrapRenderOption';
import { InfiniteScroll } from '../../utils/InfiniteScroll';

/**
 * Props of the SelectList that depend on the option type `O`.
 */
interface SelectListSelectProps<O>
    extends ReactToJSX<
        UIProps<O>,
        'renderOption' | 'value' | 'handleSelect' | 'listProps' | 'infiniteScrollOptions' | 'style'
    > {
    /** Callback fired to load more options (infinite scroll). */
    onLoadMore?: () => void;
    /**
     * Custom option render function.
     * Must return a `<SelectList.Option>` element (other elements are ignored).
     */
    renderOption?: (option: O, index: number) => React.ReactNode;
}

type CommonSelectListProps<O> = SelectListSelectProps<O> &
    GenericProps &
    /** Accessible name of the listbox (required): `aria-label` or `aria-labelledby`. */
    HasAriaLabelOrLabelledBy & {
        /**
         * Status of the list.
         * @default 'idle'
         */
        listStatus?: SelectListStatus;
        /** Optional translations for screen-reader announcements (loading/empty/error/option count). */
        translations?: SelectListTranslations;
    };

/**
 * SelectList props.
 *
 * @template O Option type.
 * @template S Selection type (`'single'` or `'multiple'`).
 */
export type SelectListProps<O, S extends 'single' | 'multiple' = 'single'> = CommonSelectListProps<O> & {
    /** Single (default) or multiple selection. */
    selectionType?: S;
    /** Selected option (single) or options (multiple). */
    value?: S extends 'multiple' ? O[] : O;
    /** Called with the new selected option (single) or options (multiple). */
    onChange?: S extends 'multiple' ? (newValue: O[]) => void : (newValue: O) => void;
};

/** Single selection SelectList props. */
export type SingleSelectListProps<O> = NamedProps<SelectListProps<O, 'single'>>;

/** Multiple selection SelectList props. */
export type MultipleSelectListProps<O> = NamedProps<SelectListProps<O, 'multiple'>>;

type ForwardRefSelectList = (
    render: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: any,
        ref: ForwardedRef<unknown>,
    ) => React.ReactNode,
) => {
    <O, S extends 'single' | 'multiple' = 'single'>(
        props: SelectListProps<O, S> & { ref?: React.Ref<HTMLDivElement> },
    ): React.ReactNode;
    displayName?: string;
};

/**
 * A list of options always visible on the page (WAI-ARIA listbox pattern), for single or multiple selection.
 *
 * The listbox is a single tab stop: the arrow keys (and typeahead) move between the options,
 * and Enter, Space or a click selects the active option.
 *
 * @family Inputs
 *
 * @param props Component props.
 * @param ref   Component ref (root element).
 * @return React element.
 */
export const SelectList = (React.forwardRef as ForwardRefSelectList)((props, ref) => {
    const {
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        getSectionId,
        renderSectionTitle,
        selectionType = DEFAULT_PROPS.selectionType,
        value,
        onChange,
        onLoadMore,
        listStatus,
        translations,
        ...forwardedProps
    } = props;

    const isMultiple = selectionType === 'multiple';

    // Inject core-computed props into the consumer's renderOption result.
    const wrappedRenderOption = wrapRenderOption(renderOption);

    // Map the core's option-id selection back to the option object(s).
    // The list is always visible (no clear button): selecting the selected option again deselects it.
    const handleSelect = useCallback(
        (selectedOption: { value: string }) => {
            const next = toggleSelection(options, getOptionId, value, selectedOption?.value, isMultiple, true);
            onChange?.(next);
        },
        [getOptionId, isMultiple, onChange, options, value],
    );

    return UI(
        {
            ...forwardedProps,
            ref,
            options,
            getOptionId,
            getOptionName,
            getOptionDescription,
            renderOption: wrappedRenderOption,
            getSectionId,
            renderSectionTitle,
            value,
            selectionType,
            handleSelect,
            listStatus,
            translations,
            onLoadMore,
            infiniteScrollOptions: { rootMargin: '100px' },
        },
        { Listbox, InfiniteScroll },
    );
});
SelectList.displayName = COMPONENT_NAME;
