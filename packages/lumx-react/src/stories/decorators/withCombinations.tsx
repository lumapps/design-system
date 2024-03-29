/* eslint-disable react/display-name,jsx-a11y/control-has-associated-label */
import React from 'react';
import isEmpty from 'lodash/isEmpty';

type PropCombination = Record<string, Record<string, unknown>>;
type PropArrayCombination = { key: string; options: Array<any> };
type Combination = PropArrayCombination | PropCombination;

const toProps = <E,>(arr: Array<E>, prop: string) =>
    Object.fromEntries(arr.map((value) => [value || '', { [prop]: value }]));

const isArrayConfig = (c?: Combination): c is PropArrayCombination => !!c?.key;

function formatProps(config?: Combination): PropCombination {
    if (isEmpty(config)) return { '': {} };
    if (isArrayConfig(config)) return toProps(config.options, config.key);
    return config as PropCombination;
}

/**
 * SB decorator generating a tables of combination of props (max 3 levels of props)
 */
export const withCombinations =
    ({
        combinations,
        tableStyle,
        firstColStyle,
        cellStyle,
        combinator = Object.assign,
    }: {
        /** Props combinations */
        combinations: {
            rows?: Combination;
            cols?: Combination;
            sections?: Combination;
        };
        /** Inject style on table */
        tableStyle?: React.CSSProperties;
        /** Inject style on first col */
        firstColStyle?: React.CSSProperties;
        /** Inject style on cells */
        cellStyle?: React.CSSProperties;
        /** Combinator function */
        combinator?: (a: any, b: any) => any;
    }) =>
    (Story: any, ctx: any) => {
        const rows = formatProps(combinations.rows);
        const cols = formatProps(combinations.cols);
        const sections = formatProps(combinations.sections);

        return (
            <>
                {Object.entries(sections).map(([level2Key, level2Value]) => (
                    <div key={level2Key}>
                        {level2Key && <h2>{level2Key}</h2>}

                        <table style={{ ...tableStyle, borderCollapse: 'separate', borderSpacing: 8 }}>
                            {combinations.cols && (
                                <thead>
                                    <tr>
                                        <th />
                                        {Object.keys(cols).map((key) => (
                                            <th key={key}>
                                                <small>{key}</small>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {Object.entries(rows).map(([level0Key, level0Value], i1) => (
                                    <tr key={i1}>
                                        <th style={{ ...firstColStyle, textAlign: 'left' }}>
                                            <small>{level0Key}</small>
                                        </th>
                                        {Object.entries(cols).map(([level1Key, level1Value]) => {
                                            const args = [level0Value, level1Value, level2Value].reduce(
                                                (acc, value) => combinator(acc, value),
                                                { ...ctx.args },
                                            );
                                            return (
                                                <td
                                                    key={level1Key}
                                                    style={{
                                                        textAlign: combinations.cols ? 'center' : undefined,
                                                        ...cellStyle,
                                                    }}
                                                >
                                                    <Story args={args} />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </>
        );
    };
