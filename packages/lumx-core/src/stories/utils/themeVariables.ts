import type { Predicate } from '../../js/types/Predicate';

/** Property value - either a string or an object with a value property */
export type Property = string | { value: string };

/** Nested tree structure of properties (matches DESIGN_TOKENS structure) */
export interface PropertyTree {
    [key: string]: PropertyTree | Property;
}

/** Variable entry as [name, value] tuple */
export type Entry = [key: string, value: string];

/** Map of variable names to their values */
export type Variables = Record<string, string>;

/** Options for theming variables configuration */
export interface ThemeVariablesOptions<P extends PropertyTree = PropertyTree> {
    /** Property tree from DESIGN_TOKENS */
    properties?: P;
    /** Initial CSS variable values (either CSS string or property tree) */
    values?: string | Partial<P>;
}

/** Result of theme data preparation */
export interface ThemeData {
    /** Initial style variables parsed from values option */
    initialStyle: Variables;
    /** Default style variables from properties tree */
    defaultStyle: Variables;
    /** Set of all variable names (union of initial and default) */
    varNames: Set<string>;
    /** Function that filters styles based on story args */
    filteredStyles: (args: any) => () => Variables;
}

/** Props that affect variable filtering (theme, emphasis, size) */
const FILTER_PROPS = ['theme', 'emphasis', 'size'];

/**
 * Extract value from a Property or PropertyTree node
 */
function asValue(prop?: PropertyTree | Property): string | undefined {
    if (typeof prop === 'string') {
        return prop;
    }
    if (typeof prop === 'object' && 'value' in prop) {
        return prop.value as string;
    }
    return undefined;
}

/**
 * Convert property tree into a flat list of [key, value] entries.
 * Recursively traverses the tree and constructs CSS variable names.
 *
 * @example
 * toArgEntries({ chip: { 'border-color': { value: 'red' } } }, '--lumx')
 * // yields ['--lumx-chip-border-color', 'red']
 */
function* toArgEntries(props: PropertyTree | Property, parent = ''): Iterable<Entry> {
    const value = asValue(props);
    if (value) {
        yield [parent, value];
    } else {
        for (const [key, prop] of Object.entries(props)) {
            const newParent = parent ? `${parent}-${key}` : key;
            yield* toArgEntries(prop, newParent);
        }
    }
}

/**
 * Parse CSS variable declarations from a string.
 * Extracts variable names and values from CSS custom property declarations.
 *
 * @param cssString - CSS variable declarations (e.g., "--lumx-chip-color: red;")
 * @param strict - If true, throw error on parse failure; if false, skip invalid lines
 *
 * @example
 * parseVariableEntries("--lumx-chip-color: red; --lumx-chip-size: 10px;")
 * // yields ['--lumx-chip-color', 'red'], ['--lumx-chip-size', '10px']
 */
function* parseVariableEntries(cssString: string, strict = false): Iterable<Entry> {
    for (const line of cssString.split(/(?<=;)/)) {
        if (!line.trim()) continue;
        const match = line.match(/^\s*(--lumx[^:]+)\s*:\s*([^;]+);/m);
        if (!match) {
            if (strict) throw new Error(`Could not parse \`${line}\``);
            else continue;
        }
        const [, variableName, variableValue] = match;
        yield [variableName, variableValue];
    }
}

/**
 * Prepare theme variable data for use in theming decorators.
 * Converts property trees and CSS strings into filtered variable maps.
 *
 * @param options - Theming configuration (properties tree and initial values)
 * @param args - Story args used for filtering (theme, emphasis, size, etc.)
 * @returns Prepared theme data with initial/default styles and filtering function
 */
export function prepareThemeData(options: ThemeVariablesOptions): ThemeData {
    const { properties, values } = options;

    // Parse initial style from values (either CSS string or property tree)
    const initialStyle = values
        ? Object.fromEntries(
              typeof values === 'string'
                  ? parseVariableEntries(values)
                  : toArgEntries(values as PropertyTree, '--lumx'),
          )
        : {};

    // Extract default style from properties tree
    const defaultStyle = Object.fromEntries(properties ? Array.from(toArgEntries(properties, '--lumx')) : []);

    // Union of all variable names
    const varNames = new Set(Object.keys(initialStyle).concat(Object.keys(defaultStyle)));

    /**
     * Filter styles based on story args.
     * Only shows variables relevant to current component state (theme, emphasis, size).
     *
     * @example
     * filteredStyles({ theme: 'dark', emphasis: 'high' })
     * // Returns only variables containing 'theme-dark' and 'emphasis-high'
     */
    function filteredStyles(args: any) {
        // Create filter predicates from args
        const filterArgs = Object.entries(args)
            .map(([argName, argValue]) => {
                if (typeof argValue === 'string' && FILTER_PROPS.includes(argName)) {
                    return (varName: string) =>
                        // Has the given arg with value
                        varName.match(new RegExp(`${argName}-${argValue}`)) ||
                        // Special case: medium/low emphasis can use selected emphasis variables
                        (argName === 'emphasis' &&
                            (argValue === 'medium' || argValue === 'low') &&
                            varName.match(/emphasis-selected/)) ||
                        // Or does not have the arg at all (applies to all values)
                        !varName.match(new RegExp(`${argName}-\\w+`));
                }
                return false;
            })
            .filter(Boolean) as Array<Predicate<string>>;

        // Filter variables that match all predicates
        const styles = Object.fromEntries(
            Array.from(varNames.values())
                .map((varName) => {
                    if (!filterArgs.every((filter) => filter(varName))) return null as any;
                    return [varName, initialStyle[varName] || defaultStyle[varName]];
                })
                .filter(Boolean),
        );

        return () => styles;
    }

    return {
        initialStyle,
        defaultStyle,
        varNames,
        filteredStyles,
    };
}
