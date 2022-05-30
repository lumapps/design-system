import { useEffect, useState } from 'react';
import { useLocation } from '@reach/router';
import filter from 'lodash/fp/filter';

interface SearchResult {
    slug: string;
    title: string;
    content: string;
    parentTitlePath: string[];
}

type searchFunction = (searchTerm: string) => Promise<SearchResult[]>;

// Load worker module and instantiate (method mapping is handled by the `workerize-loader`).
const loadWorker = async () => {
    const module = await import(
        /* webpackChunkName: "search-worker" */
        './search.worker'
    );
    const SearchWorker = (module as any).default;
    return new SearchWorker() as typeof module;
};

/**
 * Implement search
 * - Lazy loads the search worker
 * - Handles search with loading state on query change.
 */
export function useSearch() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchResult[] | undefined>([]);
    const [searchFunction, setSearchFunction] = useState<searchFunction>();
    const { pathname } = useLocation();

    useEffect(() => {
        // Load the web worker.
        loadWorker().then((worker) => {
            // Load the search index:
            const searchIndexURL = new URL('/search_index.json', document.baseURI).toString();
            worker.loadIndex(searchIndexURL);
            setSearchFunction(() => worker.search);
        });
    }, []);

    // On search:
    useEffect(() => {
        if (query) {
            // Unset results (loading state)
            setResults(undefined);
            searchFunction?.(query)
                // Remove current page from results
                .then(filter((result) => result.slug !== pathname))
                // Set results
                .then(setResults);
        } else {
            // No result
            setResults([]);
        }
    }, [pathname, query, searchFunction]);

    return { query, setQuery, results };
}
