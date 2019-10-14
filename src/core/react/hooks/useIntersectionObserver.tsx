/**
 * Convenient hook to create interaction observers
 */
// tslint:disable: no-any typedef

import { useEffect, useRef, useState } from 'react';

export default ({ root = null, rootMargin = '0 px', threshold = [0] }: any): [any, IntersectionObserverEntry] => {
    const [currentEntry, updateCurrentEntry] = useState<any>();
    const [node, setNode] = useState(null);

    const observer = useRef(
        new IntersectionObserver(([entry]) => updateCurrentEntry(entry), {
            root,
            rootMargin,
            threshold,
        }),
    );

    useEffect(() => {
        const { current: currentObserver } = observer;
        currentObserver.disconnect();

        if (node) {
            currentObserver.observe(node!);
        }

        return () => currentObserver.disconnect();
    }, [node]);

    return [setNode, currentEntry];
};
