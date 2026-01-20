import findLast from 'lodash/findLast';

import { Action, OptionsUpdatedAction, Reducer, State } from '../types';
import { buildLoopAroundObject, tabStopIsEnabled } from '../utils';
import { KEY_NAV } from './keyboard-navigation';
import {
    REGISTER_TAB_STOP,
    UNREGISTER_TAB_STOP,
    UPDATE_TAB_STOP,
    SELECT_TAB_STOP,
    SET_ALLOW_FOCUSING,
    RESET_SELECTED_TAB_STOP,
} from './tab-stop';

export const INITIAL_STATE: State = {
    selectedId: null,
    allowFocusing: false,
    tabStops: [],
    direction: 'horizontal',
    loopAround: buildLoopAroundObject(false),
    gridMap: null,
    defaultSelectedId: null,
    autofocus: undefined,
    isUsingKeyboard: false,
};

const OPTIONS_UPDATED: Reducer<OptionsUpdatedAction> = (state, action) => {
    const { autofocus } = action.payload;
    let { selectedId, allowFocusing } = state;

    // Update selectedId when updating the `autofocus` option.
    if (!state.autofocus && autofocus) {
        if (autofocus === 'first') {
            selectedId = state.tabStops.find(tabStopIsEnabled)?.id || null;
        } else if (autofocus === 'last') {
            selectedId = findLast(state.tabStops, tabStopIsEnabled)?.id || null;
        }
        allowFocusing = true;
    }

    return {
        ...state,
        ...action.payload,
        selectedId,
        allowFocusing: action.payload.allowFocusing || allowFocusing,
        loopAround: buildLoopAroundObject(action.payload.loopAround),
    };
};

/** Reducers for each action type: */
const REDUCERS: { [Type in Action['type']]: Reducer<Extract<Action, { type: Type }>> } = {
    REGISTER_TAB_STOP,
    UNREGISTER_TAB_STOP,
    UPDATE_TAB_STOP,
    SELECT_TAB_STOP,
    OPTIONS_UPDATED,
    KEY_NAV,
    SET_ALLOW_FOCUSING,
    RESET_SELECTED_TAB_STOP,
};

/** Main reducer */
export const reducer: Reducer<Action> = (state, action) => {
    return REDUCERS[action.type]?.(state, action as any) || state;
};
