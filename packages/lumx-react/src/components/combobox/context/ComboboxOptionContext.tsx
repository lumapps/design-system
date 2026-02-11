import React, { ReactNode, createContext, useContext } from 'react';

export interface ComboboxOptionContextValue {
    optionId?: string;
    isKeyboardHighlighted?: boolean;
}
export const ComboboxOptionContext = createContext<ComboboxOptionContextValue>({});

interface ComboboxOptionIdProviderProps extends Required<ComboboxOptionContextValue> {
    /** Option to display */
    children: ReactNode;
}

/** Context Provider to store the current combobox option id. */
export const ComboboxOptionContextProvider = ({
    optionId,
    isKeyboardHighlighted,
    children,
}: ComboboxOptionIdProviderProps) => {
    const value = React.useMemo(() => ({ optionId, isKeyboardHighlighted }), [optionId, isKeyboardHighlighted]);
    return <ComboboxOptionContext.Provider value={value}>{children}</ComboboxOptionContext.Provider>;
};

/**
 * Retrieve the current combobox option id.
 * Must be used within a ComboboxOptionIdProvider
 */
export const useComboboxOptionContext = () => {
    const comboboxOption = useContext(ComboboxOptionContext);

    if (!comboboxOption?.optionId) {
        throw new Error('This hook must be used within a ComboboxOptionIdProvider');
    }

    return comboboxOption as Required<ComboboxOptionContextValue>;
};
