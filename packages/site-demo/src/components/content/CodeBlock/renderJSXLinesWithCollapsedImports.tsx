import { ReactElement } from 'react';
import { renderLines } from '@lumx/demo/components/content/CodeBlock/renderLines';
import { RenderLineParams, TokenLines } from './types';

/** Split lines before export default (or after imports) */
export function partitionCode(tokenLines: TokenLines): { collapsed: TokenLines; visible: TokenLines } {
    let splitIndex = 0;

    // 1. Search for 'export default'
    for (let i = 0; i < tokenLines.length; i++) {
        const line = tokenLines[i];
        let hasExport = false;
        let hasDefault = false;
        for (const token of line) {
            if (token.types.includes('keyword')) {
                if (token.content === 'export') {
                    hasExport = true;
                } else if (hasExport && token.content === 'default') {
                    hasDefault = true;
                    break;
                }
            }
        }
        if (hasDefault) {
            splitIndex = i;
            break;
        }
    }

    // 2. Fallback: Search for last import
    if (splitIndex === 0) {
        for (let i = tokenLines.length - 1; i >= 0; i--) {
            const line = tokenLines[i];
            const hasImport = line.some((token) => token.types.includes('keyword') && token.content === 'import');
            if (hasImport) {
                splitIndex = i + 1;
                break;
            }
        }
    }

    const visible = [...tokenLines];
    const collapsed = visible.splice(0, splitIndex);
    return { collapsed, visible };
}

/** Render code lines with collapsed imports/setup */
export const renderJSXLinesWithCollapsedImports = (renderParams: RenderLineParams): ReactElement => {
    const { collapsed, visible } = partitionCode(renderParams.tokens);

    // Get the first non-comment/non-whitespace token
    let firstTokenContent = '…';
    for (const line of collapsed) {
        for (const token of line) {
            const content = token.content.trim();
            if (content && !token.types.includes('comment')) {
                firstTokenContent = content;
                break;
            }
        }
        if (firstTokenContent !== '…') break;
    }

    return (
        <>
            {collapsed.length ? (
                <details>
                    <summary
                        className="lumx-button lumx-button--emphasis-medium lumx-button--color-dark"
                        aria-label="Expand code"
                        title="Expand code"
                    >
                        {firstTokenContent} …
                    </summary>
                    {renderLines({ ...renderParams, tokens: collapsed })}
                </details>
            ) : null}
            {renderLines({ ...renderParams, tokens: visible })}
        </>
    );
};
