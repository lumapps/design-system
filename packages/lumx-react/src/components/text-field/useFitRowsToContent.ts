import React, { useState } from 'react';

/**
 * Fit textarea rows to its content
 */
export function useFitRowsToContent(
    minimumRows: number,
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    value: string | undefined,
) {
    const [rows, setRows] = useState(minimumRows);
    React.useLayoutEffect(() => {
        const { current: textarea } = textareaRef;
        if (!textarea) {
            return;
        }

        // Save the current number of rows to restore it later and avoid a flicker.
        const previousRows = textarea.rows;

        // Set the rows to the minimum to get a baseline for row height.
        // This is necessary to get a consistent row height calculation.
        textarea.rows = minimumRows;
        const rowHeight = textarea.clientHeight / minimumRows;

        // Set rows to 1 to get the smallest possible textarea, which forces
        // scrollHeight to be the actual content height.
        textarea.rows = 1;
        const { scrollHeight } = textarea;

        // Restore the rows to the previous value.
        textarea.rows = previousRows;

        // Calculate the number of rows required to display the content.
        // Fallback to `minimumRows` if `rowHeight` is 0.
        const requiredRows = rowHeight > 0 ? Math.ceil(scrollHeight / rowHeight) : minimumRows;

        // Update the rows state with the new calculated value.
        setRows(Math.max(requiredRows, minimumRows));
    }, [value, minimumRows, textareaRef]);
    return rows;
}
