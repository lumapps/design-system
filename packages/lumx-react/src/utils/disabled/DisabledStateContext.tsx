import React, { useContext } from 'react';

/** Disable state */
type DisabledStateContextValue =
    | {
          state: 'disabled';
      }
    | { state: undefined | null };

export const DisabledStateContext = React.createContext<DisabledStateContextValue>({ state: null });

export type DisabledStateProviderProps = DisabledStateContextValue & {
    children: React.ReactNode;
};

/**
 * Disabled state provider.
 * All nested LumX Design System components inherit this disabled state.
 */
export function DisabledStateProvider({ children, ...value }: DisabledStateProviderProps) {
    return <DisabledStateContext.Provider value={value}>{children}</DisabledStateContext.Provider>;
}

/**
 * Get DisabledState context value
 */
export function useDisabledStateContext(): DisabledStateContextValue {
    return useContext(DisabledStateContext);
}
