import React from 'react';

import { cached, filter, take } from '@lumx/demo/utils/iterable';

interface IconMeta {
    name: string;
    path: string;
    aliases: string[];
}

/**
 * Asynchronously fetch all `@lumx/icons` and then filter them to display in the icon library
 */
export function useIconLibrary(searchText: string, { maxCount: initialMaxCount }: { maxCount: number }) {
    const [maxCount, setMaxCount] = React.useState(initialMaxCount);
    const [iconEntries, setIconEntries] = React.useState<Array<IconMeta>>();

    React.useEffect(() => {
        // Fetch all icons
        import('@lumx/icons/override/generated/icon-library.json').then(({ icons }) => setIconEntries(icons));
    }, []);

    // Load more by increasing the max count
    const onLoadMore = React.useCallback(() => {
        setMaxCount((prevMaxCount) => prevMaxCount + initialMaxCount);
    }, [initialMaxCount]);

    // Reset max count on search text change
    React.useEffect(() => {
        setMaxCount(initialMaxCount);
    }, [initialMaxCount, searchText]);

    // Cached filtered iterable of icons
    const filtered = React.useMemo(() => {
        if (!iconEntries) return undefined;

        const formatted = searchText.toLowerCase();
        return cached(
            filter(
                iconEntries,
                (i) => i.name.includes(formatted) || i.aliases?.some((aliasName) => aliasName.includes(formatted)),
            ),
        );
    }, [iconEntries, searchText]);

    return React.useMemo(() => {
        if (!filtered) {
            return {};
        }

        const iterable = filtered();

        // Limit to the max count
        const icons = Array.from(take(iterable, maxCount));

        // Check we have more to display
        const hasMore = !!iterable.next().value;

        return { icons, onLoadMore: hasMore ? onLoadMore : undefined };
    }, [filtered, maxCount, onLoadMore]);
}
