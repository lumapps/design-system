import { CombinationsOptions, prepareMatrixData, defaultCombinator, DEFAULT_TABLE_STYLE } from './combinations';

/** Nested components injected by framework-specific wrappers */
type NestedComponents = {
    /** Provider that tracks heading nesting level */
    HeadingLevelProvider: any;
    /** Heading component that renders at the current level */
    Heading: any;
    /** Story component that renders a story with given args */
    Story: any;
};

/** Parameters for the CombinationsTable function */
type CombinationsTableParams = {
    /** Storybook context */
    ctx: any;
    /** Combination options (layout, styles, combinations config) */
    options: CombinationsOptions;
    /** Framework-specific components */
    nestedComponents: NestedComponents;
};

/**
 * Generic JSX template that renders a matrix/table of story combinations.
 * Framework-agnostic: works with both React and Vue JSX by receiving
 * framework-specific components (HeadingLevelProvider, Heading, Story) as params.
 */
export function CombinationsTable({ ctx, options, nestedComponents }: CombinationsTableParams) {
    const {
        combinations,
        tableStyle,
        firstColStyle,
        cellStyle,
        colStyle,
        sectionStyle,
        combinator = defaultCombinator,
        excludeCombination,
    } = options;

    const { HeadingLevelProvider, Heading, Story } = nestedComponents;

    const { sections, hasRows, hasCols } = prepareMatrixData({
        combinations,
        baseArgs: ctx.args,
        combinator,
        excludeCombination,
    });

    return (
        <>
            {sections.map((section) => (
                <section key={section.key} style={sectionStyle}>
                    <HeadingLevelProvider>
                        {section.key && <Heading style={{ textTransform: 'capitalize' }}>{section.key}</Heading>}

                        {hasRows || hasCols ? (
                            <table style={{ ...DEFAULT_TABLE_STYLE, ...tableStyle }}>
                                {combinations.cols && (
                                    <thead>
                                        <tr>
                                            {hasRows && <th aria-hidden />}
                                            {section.cols.map(([key]) => (
                                                <th key={key} style={colStyle}>
                                                    <small>{key}</small>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                )}
                                <tbody>
                                    {section.rows.map((row, rowIndex) => {
                                        if (row.excluded) return null;

                                        return (
                                            <tr key={rowIndex}>
                                                {hasRows && (
                                                    <th style={{ ...firstColStyle, textAlign: 'left' }}>
                                                        <small>{row.key}</small>
                                                    </th>
                                                )}
                                                {row.cells.map((cell) => {
                                                    const textAlign = combinations.cols ? 'center' : undefined;
                                                    return (
                                                        <td key={cell.key} style={{ textAlign, ...cellStyle }}>
                                                            {cell.excluded ? null : <Story args={cell.args} />}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <Story args={section.args} />
                        )}
                    </HeadingLevelProvider>
                </section>
            ))}
        </>
    );
}
