import findLast from 'lodash/findLast';
import findLastIndex from 'lodash/findLastIndex';

import {
    Reducer,
    RegisterAction,
    ResetSelectedTabStopAction,
    SelectTabStopAction,
    SetAllowFocusingAction,
    State,
    UnregisterAction,
    UpdateTabStopAction,
} from '../types';
import { tabStopIsEnabled } from '../utils';

/** Determine the updated value for selectedId: */
export const getUpdatedSelectedId = (
    tabStops: State['tabStops'],
    currentSelectedId: State['selectedId'],
    defaultSelectedId: State['selectedId'] = null,
): State['selectedId'] => {
    // Get tab stop by id
    const tabStop = currentSelectedId && tabStops.find((ts) => ts.id === currentSelectedId && !ts.disabled);
    if (!tabStop) {
        // Fallback to default selected id if available, or first enabled tab stop if not
        return tabStops.find((ts) => ts.id === defaultSelectedId)?.id || tabStops.find(tabStopIsEnabled)?.id || null;
    }
    return tabStop?.id || defaultSelectedId;
};

/** Handle `REGISTER_TAB_STOP` action registering a new tab stop. */
export const REGISTER_TAB_STOP: Reducer<RegisterAction> = (state, action) => {
    const newTabStop = action.payload;
    const newTabStopElement = newTabStop.domElementRef.current;

    if (!newTabStopElement) {
        return state;
    }

    // Find index of tab stop that
    const indexToInsertAt = findLastIndex(state.tabStops, (tabStop) => {
        if (tabStop.id === newTabStop.id) {
            // tab stop already registered
            return false;
        }
        const domTabStop = tabStop.domElementRef.current;

        // New tab stop is following the current tab stop
        return domTabStop?.compareDocumentPosition(newTabStopElement) === Node.DOCUMENT_POSITION_FOLLOWING;
    });
    const insertIndex = indexToInsertAt + 1;

    // Insert new tab stop at position `indexToInsertAt`.
    const newTabStops = [...state.tabStops];
    newTabStops.splice(insertIndex, 0, newTabStop);

    // Handle autofocus if needed
    let { selectedId, allowFocusing } = state;
    if (
        (state.autofocus === 'first' && insertIndex === 0) ||
        (state.autofocus === 'last' && insertIndex === newTabStops.length - 1) ||
        newTabStop.autofocus
    ) {
        allowFocusing = true;
        selectedId = newTabStop.id;
    }

    const newSelectedId =
        newTabStop.id === state.defaultSelectedId && !newTabStop.disabled
            ? newTabStop.id
            : getUpdatedSelectedId(newTabStops, selectedId, state.defaultSelectedId);

    return {
        ...state,
        /**
         * If the tab currently being registered is enabled and set as default selected,
         * set as selected.
         *
         */
        selectedId: newSelectedId,
        tabStops: newTabStops,
        gridMap: null,
        allowFocusing,
    };
};

/** Handle `UNREGISTER_TAB_STOP` action un-registering a new tab stop. */
export const UNREGISTER_TAB_STOP: Reducer<UnregisterAction> = (state, action) => {
    const { id } = action.payload;
    const newTabStops = state.tabStops.filter((tabStop) => tabStop.id !== id);
    if (newTabStops.length === state.tabStops.length) {
        // tab stop already unregistered
        return state;
    }

    /** Get the previous enabled tab stop */
    const previousTabStopIndex = state.tabStops.findIndex(
        (tabStop) => tabStop.id === state.selectedId && tabStopIsEnabled(tabStop),
    );

    const newLocal = previousTabStopIndex - 1 > -1;
    const previousTabStop = newLocal ? findLast(newTabStops, tabStopIsEnabled, previousTabStopIndex - 1) : undefined;

    return {
        ...state,
        /** Set the focus on either the previous tab stop if found or the one set as default */
        selectedId: getUpdatedSelectedId(newTabStops, state.selectedId, previousTabStop?.id || state.defaultSelectedId),
        tabStops: newTabStops,
        gridMap: null,
    };
};

/** Handle `UPDATE_TAB_STOP` action updating properties of a tab stop. */
export const UPDATE_TAB_STOP: Reducer<UpdateTabStopAction> = (state, action) => {
    const { id, rowKey, disabled } = action.payload;
    const index = state.tabStops.findIndex((tabStop) => tabStop.id === id);
    if (index === -1) {
        // tab stop not registered
        return state;
    }

    const tabStop = state.tabStops[index];
    if (tabStop.disabled === disabled && tabStop.rowKey === rowKey) {
        // Nothing to do so short-circuit.
        return state;
    }

    const newTabStop = { ...tabStop, rowKey, disabled };
    const newTabStops = [...state.tabStops];
    newTabStops.splice(index, 1, newTabStop);

    return {
        ...state,
        selectedId: getUpdatedSelectedId(newTabStops, state.selectedId, state.defaultSelectedId),
        tabStops: newTabStops,
        gridMap: null,
    };
};

/** Handle `SELECT_TAB_STOP` action selecting a tab stop. */
export const SELECT_TAB_STOP: Reducer<SelectTabStopAction> = (state, action) => {
    const { id, type } = action.payload;

    const tabStop = state.tabStops.find((ts) => ts.id === id);
    if (!tabStop || tabStop.disabled) {
        return state;
    }

    return {
        ...state,
        allowFocusing: true,
        selectedId: tabStop.id,
        isUsingKeyboard: type === 'keyboard',
    };
};

export const SET_ALLOW_FOCUSING: Reducer<SetAllowFocusingAction> = (state, action) => {
    return {
        ...state,
        selectedId: getUpdatedSelectedId(state.tabStops, null, state.defaultSelectedId),
        allowFocusing: action.payload.allow,
        isUsingKeyboard: Boolean(action.payload.isKeyboardNavigation),
    };
};

/** Handle `RESET_SELECTED_TAB_STOP` action reseting the selected tab stop. */
export const RESET_SELECTED_TAB_STOP: Reducer<ResetSelectedTabStopAction> = (state) => {
    return {
        ...state,
        allowFocusing: false,
        selectedId: getUpdatedSelectedId(state.tabStops, null, state.defaultSelectedId),
        defaultSelectedId: getUpdatedSelectedId(state.tabStops, null, state.defaultSelectedId),
        isUsingKeyboard: false,
    };
};
