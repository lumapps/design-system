import uniqueId from 'lodash/uniqueId';

import {
    AddOptionAction,
    CloseComboboxAction,
    ComboboxAction,
    ComboboxReducer,
    ComboboxState,
    OpenComboboxAction,
    RemoveOptionAction,
    SetInputValueAction,
} from '../types';
import { isComboboxAction, isComboboxValue } from '../utils';

const comboboxId = `combobox-${uniqueId()}`;
export const initialState: ComboboxState = {
    comboboxId,
    listboxId: `${comboboxId}-popover`,
    status: 'idle',
    isOpen: false,
    inputValue: '',
    showAll: true,
    options: {},
    type: 'listbox',
    optionsLength: 0,
};

/** Actions when the combobox opens. */
const OPEN_COMBOBOX: ComboboxReducer<OpenComboboxAction> = (state, action) => {
    const { manual } = action.payload || {};
    // If the combobox was manually opened, show all suggestions
    return {
        ...state,
        showAll: Boolean(manual),
        isOpen: true,
    };
};

/** Actions when the combobox closes */
const CLOSE_COMBOBOX: ComboboxReducer<CloseComboboxAction> = (state) => {
    return {
        ...state,
        showAll: true,
        isOpen: false,
    };
};

/** Actions on input update. */
const SET_INPUT_VALUE: ComboboxReducer<SetInputValueAction> = (state, action) => {
    return {
        ...state,
        inputValue: action.payload,
        // When the user is changing the value, show only values that are related to the input value.
        showAll: false,
        isOpen: true,
    };
};

/** Register an option to the state */
const ADD_OPTION: ComboboxReducer<AddOptionAction> = (state, action) => {
    const { id, option } = action.payload;
    const { options } = state;

    if (options[id]) {
        // Option already exists, return state unchanged
        return state;
    }

    const newOptions = {
        ...options,
        [id]: option,
    };

    let newType = state.type;
    if (isComboboxAction(option)) {
        newType = 'grid';
    }

    let newOptionsLength = state.optionsLength;
    if (isComboboxValue(option)) {
        newOptionsLength += 1;
    }

    return {
        ...state,
        options: newOptions,
        type: newType,
        optionsLength: newOptionsLength,
    };
};

/** Remove an option from the state */
const REMOVE_OPTION: ComboboxReducer<RemoveOptionAction> = (state, action) => {
    const { id } = action.payload;
    const { options } = state;
    const option = options[id];

    if (!options[id]) {
        // Option doesn't exist, return state unchanged
        return state;
    }

    const newOptions = { ...options };
    delete newOptions[id];

    let newOptionsLength = state.optionsLength;
    if (isComboboxValue(option)) {
        newOptionsLength -= 1;
    }

    return {
        ...state,
        options: newOptions,
        optionsLength: newOptionsLength,
    };
};

/** Reducers for each action type: */
const REDUCERS: { [Type in ComboboxAction['type']]: ComboboxReducer<Extract<ComboboxAction, { type: Type }>> } = {
    OPEN_COMBOBOX,
    CLOSE_COMBOBOX,
    SET_INPUT_VALUE,
    ADD_OPTION,
    REMOVE_OPTION,
};

/** Main reducer */
export const reducer: ComboboxReducer<ComboboxAction> = (state, action) => {
    return REDUCERS[action.type]?.(state, action as any) || state;
};

/** Dispatch for the combobox component */
export type ComboboxDispatch = React.Dispatch<ComboboxAction>;
