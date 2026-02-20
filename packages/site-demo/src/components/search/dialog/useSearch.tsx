import { useEffect, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
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
 * - Pushes results that don't match the current framework to the end.
 */
export function useSearch(framework?: string) {
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
                // Push results that don't match the current framework to the end
                .then((docs) =>
                    framework
                        ? [...docs].sort((a, b) => {
                              const aMatches = !a.frameworks || a.frameworks.includes(framework);
                              const bMatches = !b.frameworks || b.frameworks.includes(framework);
                              if (aMatches === bMatches) return 0;
                              return aMatches ? -1 : 1;
                          })
                        : docs,
                )
                // Set results
                .then(setResults);
        } else {
            // No result
            setResults([]);
        }
    }, [framework, pathname, query]);

    return { query, setQuery, results };
}
