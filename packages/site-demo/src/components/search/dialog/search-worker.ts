import lunr from 'lunr';
import * as Comlink from 'comlink';

import { highlightTerms } from './highlight';

export interface SearchDocument {
    title: string;
    parentTitlePath: string[];
    slug: string;
    content: string;
    frameworks?: string[];
    deprecated?: boolean;
}

/** Document fields in which we want to have search term highlighted */
const HIGHLITHED_FIELDS = ['title', 'content'] satisfies Array<keyof SearchDocument>;

/** Score multiplier applied to deprecated entries to push them down the result list. */
const DEPRECATED_SCORE_PENALTY = 0.1;

interface SearchIndex {
    index: lunr.Index;
    store: Record<string, SearchDocument>;
}

/** Load search index. */
async function loadIndex(url: string): Promise<SearchIndex> {
    const response = await fetch(url);
    const { index, store } = await response.json();
    return { index: lunr.Index.load(index), store };
}

const searchIndexPromise = loadIndex(new URL('/search_index.json', global.location.origin).toString());

/** Execute a search query against the LunR index. */
async function search(rawQuery: string) {
    const { index, store } = await searchIndexPromise;
    const terms = rawQuery.toLowerCase().split(/\s+/);

    const rawResults = index.query((query) => {
        for (const term of terms) {
            // prefix search, no boost
            query.term(term, { wildcard: lunr.Query.wildcard.TRAILING, boost: 1 });

            // 'exact' match, boosted
            query.term(term, { boost: 10 });
        }
    });

    // Penalize deprecated entries so they rank below non-deprecated ones, then re-sort by score.
    const adjustedResults = rawResults
        .map(({ ref, score }) => ({
            ref,
            score: store[ref]?.deprecated ? score * DEPRECATED_SCORE_PENALTY : score,
        }))
        .sort((a, b) => b.score - a.score);

    const results = [];
    for (const { ref } of adjustedResults) {
        if (results.length === 10) {
            break;
        }

        // Get the full document from the store
        const document = { ...store[ref] };

        // Highlight search terms in title and content
        for (const field of HIGHLITHED_FIELDS) {
            document[field] = highlightTerms(document[field], terms);
        }
        results.push(document);
    }
    return results;
}

export const api = { search };
export type SearchWorkerApi = typeof api;

Comlink.expose(api);
