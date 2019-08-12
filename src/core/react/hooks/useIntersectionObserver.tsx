//https://medium.com/the-non-traditional-developer/how-to-use-an-intersectionobserver-in-a-react-hook-9fb061ac6cb5
import { useEffect, useRef, useState } from 'react';

export default ({ root = null, rootMargin, threshold = [0] }) => {
    const [entry, updateEntry] = useState<any>();
    const [node, setNode] = useState(null);

    const observer = useRef(
        new IntersectionObserver(([entry]) => updateEntry(entry), {
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

    return [setNode, entry];
};
