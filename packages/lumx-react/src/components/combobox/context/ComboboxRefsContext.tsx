import { ReactNode, RefObject, createContext, useContext, useMemo } from 'react';

interface ComboboxRefsContext {
    triggerRef: RefObject<HTMLElement>;
    anchorRef: RefObject<HTMLElement>;
}

/** Context to store the refs of the combobox elements */
const ComboboxRefsContext = createContext<ComboboxRefsContext>({
    triggerRef: { current: null },
    anchorRef: { current: null },
});

interface ComboboxRefsProviderProps extends ComboboxRefsContext {
    children: ReactNode;
}

/** Provider to store the required refs for the Combobox */
export const ComboboxRefsProvider = ({ triggerRef, anchorRef, children }: ComboboxRefsProviderProps) => {
    const value = useMemo(
        () => ({
            triggerRef,
            anchorRef,
        }),
        [triggerRef, anchorRef],
    );
    return <ComboboxRefsContext.Provider value={value}>{children}</ComboboxRefsContext.Provider>;
};

/** Retrieves the combobox elements references from context */
export const useComboboxRefs = () => {
    const refs = useContext(ComboboxRefsContext);

    if (!refs) {
        throw new Error('The useComboboxRefs hook must be called within a ComboboxRefsProvider');
    }

    return refs;
};
