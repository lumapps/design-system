/* eslint-disable react/display-name,jsx-a11y/control-has-associated-label,prefer-object-spread */
import React from 'react';
import { isEmpty } from '@lumx/core/js/utils/collection/isEmpty';
import { Heading, HeadingLevelProvider } from '@lumx/react';

type PropEntry = [key: string, value: unknown];
type PropCombination = Record<string, Record<string, unknown>>;
type PropArrayCombination = { key: string; options: Array<any> };
type Combination = PropArrayCombination | PropCombination;

const toProps = <E,>(arr: Array<E>, prop: string): PropEntry[] =>
    arr.map((value) => [String(value), { [prop]: value }]);

const isArrayConfig = (c?: Combination): c is PropArrayCombination => !!c?.key;

function toPropEntries(config?: Combination): PropEntry[] {
    if (isEmpty(config)) return [['', {}]];
    if (isArrayConfig(config)) return toProps(config.options, config.key);
    return Object.entries(config as PropCombination);
}

type Options = {
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
    /** Inject style on sections */
    sectionStyle?: React.CSSProperties;
    /** Inject style on cols */
    colStyle?: React.CSSProperties;
    /** Inject style on cells */
    cellStyle?: React.CSSProperties;
    /** Combinator function */
    combinator?: (a: any, b: any) => any;
    /** Exclude a combination */
    excludeCombination?: (args: any) => boolean;
};

/**
 * SB decorator generating a tables of combination of props (max 3 levels of props)
 */
export const withCombinations =
    ({
        combinations,
        tableStyle,
        firstColStyle,
        cellStyle,
        colStyle,
        sectionStyle,
        combinator = Object.assign,
        excludeCombination,
    }: Options) =>
    (Story: any, ctx: any) => {
        const rows = toPropEntries(combinations.rows);
        const cols = toPropEntries(combinations.cols);
        const sections = toPropEntries(combinations.sections);
        const hasRows = rows.length > 1;
        const hasCols = cols.length > 1;

        return (
            <>
                {sections.map(([level2Key, level2Value]) => {
                    const sectionArgs = combinator({ ...ctx.args }, level2Value);
                    const sectionCols = cols
                        .map(([level1Key, level1Value]) => {
                            const args = combinator({ ...sectionArgs }, level1Value);
                            if (excludeCombination?.(args)) return null;
                            return [level1Key, args];
                        })
                        .filter(Boolean) as Array<[string, any]>;
                    return (
                        <section key={level2Key} style={sectionStyle}>
                            <HeadingLevelProvider>
                                {level2Key && <Heading style={{ textTransform: 'capitalize' }}>{level2Key}</Heading>}

                                {hasRows || hasCols ? (
                                    <table style={{ ...tableStyle, borderCollapse: 'separate', borderSpacing: 8 }}>
                                        {combinations.cols && (
                                            <thead>
                                                <tr>
                                                    {hasRows && <th aria-hidden />}
                                                    {sectionCols.map(([key]) => (
                                                        <th key={key} style={colStyle}>
                                                            <small>{key}</small>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                        )}
                                        <tbody>
                                            {rows.map(([level0Key, level0Value], i1) => {
                                                const rowArgs = combinator({ ...sectionArgs }, level0Value);
                                                if (excludeCombination?.(rowArgs)) return null;
                                                return (
                                                    <tr key={i1}>
                                                        {hasRows && (
                                                            <th style={{ ...firstColStyle, textAlign: 'left' }}>
                                                                <small>{level0Key}</small>
                                                            </th>
                                                        )}
                                                        {cols.map(([level1Key, level1Value]) => {
                                                            const args = combinator({ ...rowArgs }, level1Value);
                                                            let render: React.ReactNode = <Story args={args} />;
                                                            if (excludeCombination?.(args)) render = null;
                                                            const textAlign = combinations.cols ? 'center' : undefined;
                                                            return (
                                                                <td key={level1Key} style={{ textAlign, ...cellStyle }}>
                                                                    {render}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <Story args={sectionArgs} />
                                )}
                            </HeadingLevelProvider>
                        </section>
                    );
                })}
            </>
        );
    };
