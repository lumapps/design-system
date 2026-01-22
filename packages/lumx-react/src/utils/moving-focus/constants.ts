export const LOOP_AROUND_TYPES = {
    /**
     * Will continue navigation to the next row or column and loop back to the start
     * when the last tab stop is reached
     */
    nextLoop: 'next-loop',
    /**
     * Will continue navigation to the next row or column until
     * the last tab stop is reached
     */
    nextEnd: 'next-end',
    /**
     * Will loop within the current row or column
     */
    inside: 'inside',
} as const;

export const CELL_SEARCH_DIRECTION = {
    /** Look ahead of the given position */
    asc: 'asc',
    /** Look before the given position */
    desc: 'desc',
} as const;
