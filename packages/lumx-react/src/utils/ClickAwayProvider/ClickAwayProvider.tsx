import React, { createContext, useContext, useEffect } from 'react';
import pull from 'lodash/pull';
import { ClickAwayParameters, useClickAway } from '@lumx/react/hooks/useClickAway';

const ClickAwayAncestorContext = createContext<ClickAwayParameters['refs'] | null>(null);

/**
 * Component combining the `useClickAway` hook with a React context to hook into the React component tree and make sure
 * we take into account both the DOM tree and the React tree we trying to detect click away.
 *
 * @return the react component.
 */
export const ClickAwayProvider: React.FC<ClickAwayParameters> = ({ children, callback, refs }) => {
    const ancestorChildrenRefs = useContext(ClickAwayAncestorContext);

    useEffect(() => {
        const { current: currentRefs } = refs;
        const { current: currentAncestorChildrenRefs } = ancestorChildrenRefs || {};
        if (!currentAncestorChildrenRefs || !currentRefs) {
            return undefined;
        }
        // Push current refs to parent.
        currentAncestorChildrenRefs.push(...currentRefs);
        return () => {
            // Pull current refs from parent.
            pull(currentAncestorChildrenRefs, ...currentRefs);
        };
    }, [ancestorChildrenRefs, refs]);

    useClickAway({ callback, refs });
    return <ClickAwayAncestorContext.Provider value={refs}>{children}</ClickAwayAncestorContext.Provider>;
};
ClickAwayProvider.displayName = 'ClickAwayProvider';
