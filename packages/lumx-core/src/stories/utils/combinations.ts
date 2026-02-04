/* eslint-disable prefer-object-spread */
import isEmpty from 'lodash/isEmpty';
import castArray from 'lodash/castArray';
import mergeWith from 'lodash/fp/mergeWith';

/** A tuple of [label, props] representing a single combination entry */
export type PropEntry = [key: string, value: unknown];

/** Object format for combinations: { 'label': { prop: value }, ... } */
export type PropCombination = Record<string, Record<string, unknown>>;

/** Array format for combinations: { key: 'propName', options: [...] } */
export type PropArrayCombination = { key: string; options: Array<any> };

/** Either format for defining combinations */
export type Combination = PropArrayCombination | PropCombination;

/** Style properties (compatible with both React and Vue) */
export type CSSProperties = Record<string, any>;

/** Options for the withCombinations decorator */
export type CombinationsOptions = {
    /** Props combinations */
    combinations: {
        rows?: Combination;
        cols?: Combination;
        sections?: Combination;
    };
    /** Inject style on table */
    tableStyle?: CSSProperties;
    /** Inject style on first col */
    firstColStyle?: CSSProperties;
    /** Inject style on sections */
    sectionStyle?: CSSProperties;
    /** Inject style on cols */
    colStyle?: CSSProperties;
    /** Inject style on cells */
    cellStyle?: CSSProperties;
    /** Combinator function */
    combinator?: (a: any, b: any) => any;
    /** Exclude a combination */
    excludeCombination?: (args: any) => boolean;
};

/**
 * Convert an array of values into PropEntry tuples
 */
export const toProps = <E>(arr: Array<E>, prop: string): PropEntry[] =>
    arr.map((value) => [String(value), { [prop]: value }]);

/**
 * Type guard to check if a combination is in array format
 */
export const isArrayConfig = (c?: Combination): c is PropArrayCombination => !!c?.key;

/**
 * Convert a Combination config into an array of PropEntry tuples
 */
export function toPropEntries(config?: Combination): PropEntry[] {
    if (isEmpty(config)) return [['', {}]];
    if (isArrayConfig(config)) return toProps(config.options, config.key);
    return Object.entries(config as PropCombination);
}

/** Data for a single cell in the matrix */
export type CellData = {
    key: string;
    args: Record<string, any>;
    excluded: boolean;
};

/** Data for a single row in the matrix */
export type RowData = {
    key: string;
    args: Record<string, any>;
    excluded: boolean;
    cells: CellData[];
};

/** Data for a single section in the matrix */
export type SectionData = {
    key: string;
    args: Record<string, any>;
    cols: PropEntry[];
    rows: RowData[];
};

/** Complete matrix data for rendering */
export type MatrixData = {
    sections: SectionData[];
    hasRows: boolean;
    hasCols: boolean;
};

/** Default table style */
export const DEFAULT_TABLE_STYLE: CSSProperties = {
    borderCollapse: 'separate',
    borderSpacing: '8px',
};

/** Default combinator function */
export const defaultCombinator = Object.assign;

/**
 * Combinator that merges arrays instead of overwriting them.
 * Useful for combining props like `marginAuto: ['left', 'top']` from rows and cols.
 */
export const mergeArraysCombinator = mergeWith((a: any, b: any) => {
    if (a && b) {
        return [...castArray(a), ...castArray(b)].filter(Boolean);
    }
    return undefined;
});

/** Options for prepareMatrixData */
export type PrepareMatrixDataOptions = {
    combinations: CombinationsOptions['combinations'];
    baseArgs: Record<string, any>;
    combinator?: (a: any, b: any) => any;
    excludeCombination?: (args: any) => boolean;
};

/**
 * Prepare the complete matrix data from combinations options.
 * Returns all sections, rows, and cells pre-computed.
 */
export function prepareMatrixData({
    combinations,
    baseArgs,
    combinator = defaultCombinator,
    excludeCombination,
}: PrepareMatrixDataOptions): MatrixData {
    const rowEntries = toPropEntries(combinations.rows);
    const colEntries = toPropEntries(combinations.cols);
    const sectionEntries = toPropEntries(combinations.sections);

    const hasRows = rowEntries.length > 1;
    const hasCols = colEntries.length > 1;

    const sections: SectionData[] = sectionEntries.map(([sectionKey, sectionValue]) => {
        const sectionArgs = combinator({ ...baseArgs }, sectionValue);

        // Filter cols for header display
        const cols = colEntries
            .map(([colKey, colValue]) => {
                const args = combinator({ ...sectionArgs }, colValue);
                if (excludeCombination?.(args)) return null;
                return [colKey, colValue] as PropEntry;
            })
            .filter(Boolean) as PropEntry[];

        // Prepare rows with their cells
        const rows: RowData[] = rowEntries.map(([rowKey, rowValue]) => {
            const rowArgs = combinator({ ...sectionArgs }, rowValue);
            const rowExcluded = excludeCombination?.(rowArgs) ?? false;

            // Prepare cells for this row
            const cells: CellData[] = colEntries.map(([colKey, colValue]) => {
                const cellArgs = combinator({ ...rowArgs }, colValue);
                const cellExcluded = excludeCombination?.(cellArgs) ?? false;

                return {
                    key: colKey,
                    args: cellArgs,
                    excluded: cellExcluded,
                };
            });

            return {
                key: rowKey,
                args: rowArgs,
                excluded: rowExcluded,
                cells,
            };
        });

        return {
            key: sectionKey,
            args: sectionArgs,
            cols,
            rows,
        };
    });

    return { sections, hasRows, hasCols };
}
