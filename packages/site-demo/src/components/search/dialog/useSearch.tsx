import { useEffect, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import filter from 'lodash/fp/filter';
import * as Comlink from 'comlink';
import { useFramework } from '@lumx/demo/components/layout/FrameworkContext';
import type { SearchDocument, SearchWorkerApi } from './search-worker';

const worker =
    typeof Worker !== 'undefined' &&
    Comlink.wrap<SearchWorkerApi>(new Worker(new URL('./search-worker', import.meta.url)));

/**
 * Implement search
 * - Lazy loads the search worker
 * - Handles search with loading state on query change.
 */
export function useSearch() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchDocument[] | undefined>([]);
    const { pathname } = useLocation();
    const { framework } = useFramework();

    // On search:
    useEffect(() => {
        if (query && worker) {
            // Unset results (loading state)
            setResults(undefined);
            worker
                .search(query, framework)
                // Remove current page from results
                .then(filter((result) => result.slug !== pathname))
                // Set results
                .then(setResults);
        } else {
            // No result
            setResults([]);
        }
    }, [pathname, query, framework]);

    return { query, setQuery, results };
}
