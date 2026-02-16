import React from 'react';

import noop from 'lodash/noop';

import { TextFieldProps } from '@lumx/react';

import { ComboboxDispatch, initialState } from '../ducks/reducer';
import type {
    ComboboxProps,
    ComboboxSelectionType,
    OnComboboxSelect,
    ComboboxTranslations,
    ComboboxState,
} from '../types';

export interface ComboboxContextActions {
    onSelect?: OnComboboxSelect;
    onInputChange?: TextFieldProps['onChange'];
    onOpen?: (params: { manual: boolean; currentValue: string }) => void;
}

export interface ComboboxContextProps extends ComboboxState, ComboboxContextActions {
    openOnFocus?: ComboboxProps['openOnFocus'];
    openOnClick?: ComboboxProps['openOnClick'];
    optionsLength: number;
    /** The dispatch function to manage the inner state */
    dispatch: ComboboxDispatch;
    /** The ids of the currently selected options */
    selectedIds?: Array<string>;
    /** the type of selection currently configured for the combobox */
    selectionType?: ComboboxSelectionType;
    /**
     * Whether the error state should be displayed when the status is in error.
     */
    showErrorState?: boolean;
    /**
     * Whether the empty state should be displayed when there is no results.
     */
    showEmptyState?: boolean;
    /** translations to be used across the combobox */
    translations: ComboboxTranslations;
}

/** Context for the Combobox component */
export const ComboboxContext = React.createContext<ComboboxContextProps>({
    ...initialState,
    openOnFocus: false,
    openOnClick: false,
    selectionType: 'single',
    optionsLength: 0,
    onSelect: noop,
    onInputChange: noop,
    onOpen: noop,
    dispatch: noop,
    translations: {
        clearLabel: '',
        tryReloadLabel: '',
        showSuggestionsLabel: '',
        noResultsForInputLabel: (input) => input || '',
        loadingLabel: '',
        serviceUnavailableLabel: '',
        nbOptionsLabel: (options) => `${options}`,
    },
});

/** Context for a combobox section to store its unique id */
export const SectionContext = React.createContext<{ sectionId: string; isLoading?: boolean }>({ sectionId: '' });
