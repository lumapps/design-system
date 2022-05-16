import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import take from 'lodash/fp/take';
import lunr from 'lunr';

import { highlightTerms } from './highlight';

let indexPromise;

/** Load search index. */
export function loadIndex(url) {
    indexPromise = fetch(url)
        // Parse JSON
        .then((r) => r.json())
        // Load with LunR
        .then(({ index, store }) => ({ index: lunr.Index.load(index), store }));
}

/** Execute a search query against the LunR index. */
export async function search(rawQuery) {
    const { index, store } = await indexPromise;
    const terms = rawQuery.toLowerCase().split(/\s+/);

    const rawResults = index.query((query) => {
        for (const term of terms) {
            // prefix search, no boost
            query.term(term, { wildcard: lunr.Query.wildcard.TRAILING, boost: 1 });

            // 'exact' match, boosted
            query.term(term, { boost: 10 });
        }
    });

    return flow(
        // Keep only 10 result
        take(10),
        // Format results
        map(({ ref }) => {
            // Get the full document from the store
            const document = { ...store[ref] };

            // Highlight search terms in title and content
            for (const field of ['title', 'content']) {
                document[field] = highlightTerms(document[field], terms);
            }
            return document;
        }),
    )(rawResults);
}
