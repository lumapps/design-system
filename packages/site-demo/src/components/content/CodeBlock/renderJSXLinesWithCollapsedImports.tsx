import filter from 'lodash/filter';
import first from 'lodash/first';
import last from 'lodash/last';
import partition from 'lodash/partition';
import React, { ReactElement, useMemo, useState } from 'react';
import { renderLines } from '@lumx/demo/components/content/CodeBlock/renderLines';
import { RenderLineParams, Token, TokenLines } from './types';

const isToken = (token: Token | undefined, type: string, content: string) =>
    token?.types?.includes(type) && token?.content === content;

export function partitionImports(tokenLines: TokenLines): { imports: TokenLines; others: TokenLines } {
    const state = {
        finished: false,
        inImport: false,
        inImportList: false,
    };

    const [imports, others] = partition(tokenLines, (tokens) => {
        if (state.finished) {
            return false;
        }
        const nonBlankTokens = filter(tokens, 'content');
        if (nonBlankTokens.length === 0) {
            return state.inImportList;
        }

        const firstToken = first(nonBlankTokens);
        const lastToken = last(nonBlankTokens);
        if (!state.inImport) {
            if (!isToken(firstToken, 'keyword', 'import')) {
                state.inImportList = false;
                state.finished = true;
                return false;
            }
            state.inImport = true;
            state.inImportList = true;
        }
        if (isToken(lastToken, 'punctuation', ';')) {
            state.inImport = false;
        }
        return true;
    });
    return { imports, others };
}

export const CollapsedImports: React.FC<RenderLineParams> = (props) => {
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapsed = () => setCollapsed(!collapsed);
    const renderedImports = useMemo(() => renderLines(props) as any, [props]);

    return !collapsed ? (
        renderedImports
    ) : (
        <>
            <button
                {...props.getLineProps({ key: 'collapsed-imports' })}
                style={{ border: 'none', background: 'none', padding: 0 }}
                onClick={toggleCollapsed}
                aria-label="Expand imports"
                title="Expand imports"
                type="button"
            >
                <span {...props.getTokenProps({ token: { types: ['keyword'], content: 'import' } })} />
                <span className="lumx-spacing-margin-left-tiny lumx-spacing-padding-horizontal  lumx-color-background-dark-L5">
                    …
                </span>
            </button>
            {renderLines({ ...props, tokens: [[{ types: ['plain'], content: '', empty: true }]] })}
        </>
    );
};

export const renderJSXLinesWithCollapsedImports = (renderParams: RenderLineParams): ReactElement => {
    const { imports, others } = partitionImports(renderParams.tokens);

    return (
        <>
            {imports.length ? <CollapsedImports {...renderParams} tokens={imports} /> : null}
            {renderLines({ ...renderParams, tokens: others })}
        </>
    );
};
