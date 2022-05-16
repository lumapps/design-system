import { findAll } from 'highlight-words-core';

const MAX_LENGTH = 150;
const MAX_CHUNK_LENGTH = 50;

/** Highlight search words in a text. */
export const highlightTerms = (textToHighlight: string, searchWords: string[]) => {
    // Find search words occurrences:
    const chunks: Array<{ start: number; end: number; highlight: boolean }> = findAll({ searchWords, textToHighlight });

    let highlightedText = '';
    for (let i = 0; i < chunks.length; i++) {
        // Max highlighted text length
        if (highlightedText.length > MAX_LENGTH) break;

        const { end, start, highlight } = chunks[i];
        const text = textToHighlight.substring(start, end);

        if (highlight) {
            // Wrap search word in <mark>:
            highlightedText += `<mark>${text}</mark>`;
        } else if (
            // Not last chunk
            i !== chunks.length - 1 &&
            // Chunk too long
            end - start > MAX_CHUNK_LENGTH
        ) {
            // Truncate in the middle to have more space for highlighted words.
            const end1 = text.length;
            const end2 = MAX_CHUNK_LENGTH / 3;
            highlightedText += `${text.substring(0, end2 * 2).trimEnd()}… ${text.substring(end1 - end2, end1)}`;
        } else {
            // Normal text chunk
            highlightedText += text;
        }
    }
    return highlightedText;
};
