import React from 'react';

/** Empty object */
type TooltipContextValue = NonNullable<unknown>;

const DEFAULT_VALUE = {};

/**
 * Tooltip react context simply used as a marker to know when parent react node have a tooltip
 */
const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

export const TooltipContextProvider: React.FC = ({ children }) => (
    <TooltipContext.Provider value={DEFAULT_VALUE}>{children}</TooltipContext.Provider>
);

export const useTooltipContext = () => React.useContext(TooltipContext);
