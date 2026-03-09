import { ref, watchEffect } from 'vue';
import type { Ref } from 'vue';

/**
 * Fit textarea rows to its content.
 */
export function useFitRowsToContent(
    minimumRows: Ref<number>,
    textareaRef: Ref<HTMLTextAreaElement | null>,
    value: Ref<string | undefined>,
): Ref<number> {
    const rows = ref(minimumRows.value);

    watchEffect(
        () => {
            const textarea = textareaRef.value;
            if (!textarea) return;

            const currentMinRows = minimumRows.value;
            // Track value dependency
            void value.value;

            // Save the current number of rows to restore it later and avoid a flicker.
            const previousRows = textarea.rows;

            // Set the rows to the minimum to get a baseline for row height.
            textarea.rows = currentMinRows;
            const rowHeight = textarea.clientHeight / currentMinRows;

            // Set rows to 1 to get the smallest possible textarea, which forces
            // scrollHeight to be the actual content height.
            textarea.rows = 1;
            const { scrollHeight } = textarea;

            // Restore the rows to the previous value.
            textarea.rows = previousRows;

            // Calculate the number of rows required to display the content.
            // Fallback to `minimumRows` if `rowHeight` is 0.
            const requiredRows = rowHeight > 0 ? Math.ceil(scrollHeight / rowHeight) : currentMinRows;

            rows.value = Math.max(requiredRows, currentMinRows);
        },
        { flush: 'post' },
    );

    return rows;
}
