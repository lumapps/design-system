import { createContext, RefObject, useContext, useEffect, useMemo, useRef } from 'react';
import { ClickAwayParameters, useClickAway } from '@lumx/react/hooks/useClickAway';

interface ContextValue {
    childrenRefs: Array<RefObject<HTMLElement>>;
    addRefs(...newChildrenRefs: Array<RefObject<HTMLElement>>): void;
}

const ClickAwayAncestorContext = createContext<ContextValue | null>(null);

interface ClickAwayProviderProps extends ClickAwayParameters {
    /**
     * (Optional) Element that should be considered as part of the parent
     */
    parentRef?: RefObject<HTMLElement>;
    /**
     * Children
     */
    children?: React.ReactNode;
}

/**
 * Component combining the `useClickAway` hook with a React context to hook into the React component tree and make sure
 * we take into account both the DOM tree and the React tree to detect click away.
 *
 * @return the react component.
 */
export const ClickAwayProvider: React.FC<ClickAwayProviderProps> = ({
    children,
    callback,
    childrenRefs,
    parentRef,
}) => {
    const parentContext = useContext(ClickAwayAncestorContext);
    const currentContext = useMemo(() => {
        const context: ContextValue = {
            childrenRefs: [],
            /**
             * Add element refs to the current context and propagate to the parent context.
             */
            addRefs(...newChildrenRefs) {
                // Add element refs that should be considered as inside the click away context.
                context.childrenRefs.push(...newChildrenRefs);

                if (parentContext) {
                    // Also add then to the parent context
                    parentContext.addRefs(...newChildrenRefs);
                    if (parentRef) {
                        // The parent element is also considered as inside the parent click away context but not inside the current context
                        parentContext.addRefs(parentRef);
                    }
                }
            },
        };
        return context;
    }, [parentContext, parentRef]);

    useEffect(() => {
        const { current: currentRefs } = childrenRefs;
        if (!currentRefs) {
            return;
        }
        currentContext.addRefs(...currentRefs);
    }, [currentContext, childrenRefs]);

    useClickAway({ callback, childrenRefs: useRef(currentContext.childrenRefs) });
    return <ClickAwayAncestorContext.Provider value={currentContext}>{children}</ClickAwayAncestorContext.Provider>;
};
ClickAwayProvider.displayName = 'ClickAwayProvider';
