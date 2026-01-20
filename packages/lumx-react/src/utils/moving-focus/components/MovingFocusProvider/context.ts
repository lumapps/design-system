import React from 'react';

import noop from 'lodash/noop';

import { INITIAL_STATE } from '../../ducks/slice';
import { Action, State } from '../../types';

export type MovingFocusContext = Readonly<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>;

export const MovingFocusContext = React.createContext<MovingFocusContext>({
    state: INITIAL_STATE,
    dispatch: noop,
});
