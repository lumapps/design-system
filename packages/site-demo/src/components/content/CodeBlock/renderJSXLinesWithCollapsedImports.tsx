import filter from 'lodash/filter';
import first from 'lodash/first';
import last from 'lodash/last';
import partition from 'lodash/partition';
import React, { ReactElement } from 'react';
import { renderLines } from '@lumx/demo/components/content/CodeBlock/renderLines';
import { RenderLineParams, Token, TokenLines } from './types';

const isToken = (token: Token | undefined, type: string, content: string) =>
    token?.types?.includes(type) && token?.content === content;

/** Split import lines from other lines */
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

/** Render code lines with collapsed imports */
export const renderJSXLinesWithCollapsedImports = (renderParams: RenderLineParams): ReactElement => {
    const { imports, others } = partitionImports(renderParams.tokens);

    return (
        <>
            {imports.length ? (
                <details>
                    <summary
                        className="lumx-button lumx-button--emphasis-medium lumx-button--color-dark"
                        aria-label="Expand imports"
                        title="Expand imports"
                    >
                        import …
                    </summary>
                    {renderLines({ ...renderParams, tokens: imports })}
                </details>
            ) : null}
            {renderLines({ ...renderParams, tokens: others })}
        </>
    );
};
