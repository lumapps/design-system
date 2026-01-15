import { useEffect, useState } from 'react';
import { useLocation } from '@reach/router';
import filter from 'lodash/fp/filter';
import * as Comlink from 'comlink';
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

    // On search:
    useEffect(() => {
        if (query && worker) {
            // Unset results (loading state)
            setResults(undefined);
            worker
                .search(query)
                // Remove current page from results
                .then(filter((result) => result.slug !== pathname))
                // Set results
                .then(setResults);
        } else {
            // No result
            setResults([]);
        }
    }, [pathname, query]);

    return { query, setQuery, results };
}
