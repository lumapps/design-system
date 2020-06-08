import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { ClickAwayParameters, useClickAway } from '@lumx/react/hooks';

import uniq from 'lodash/uniq';

type appendChildrenRefsType = (refs: ClickAwayParameters['refs']) => void;
const ClickAwayAncestorContext = createContext<appendChildrenRefsType | null>(null);

/**
 * The `ClickAwayProvider` component combines the `useClickAway` hook with a React context to hook into the React
 * component tree and make sure we take into account both the DOM tree and the React tree we trying to detect click away.
 *
 * @return the react component.
 */
export const ClickAwayProvider: React.FC<ClickAwayParameters> = ({ children, callback, refs }) => {
    const appendAncestorChildrenRefs = useContext(ClickAwayAncestorContext);
    const [childrenRefs, setChildrenRefs] = useState<ClickAwayParameters['refs']>([]);

    const appendChildrenRefs = useCallback(
        (newChildrenRefs: ClickAwayParameters['refs']) => {
            setChildrenRefs(uniq([...childrenRefs, ...newChildrenRefs]));
        },
        [childrenRefs, setChildrenRefs],
    );

    const clickAwayRefs = useMemo(() => {
        // Use current refs and children refs in click away detection.
        const concatenatedRefs = [...refs, ...childrenRefs];

        // Forward refs to parent click away context.
        appendAncestorChildrenRefs?.(concatenatedRefs);

        return concatenatedRefs;
    }, [refs, childrenRefs]);

    useClickAway({ callback, refs: clickAwayRefs });
    return <ClickAwayAncestorContext.Provider value={appendChildrenRefs} children={children} />;
};
ClickAwayProvider.displayName = 'ClickAwayProvider';
