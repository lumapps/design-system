import { ReactElement } from 'react';
import { renderLines } from '@lumx/demo/components/content/CodeBlock/renderLines';
import { RenderLineParams, TokenLines } from './types';

/** Split import lines from other lines */
export function partitionImports(tokenLines: TokenLines): { imports: TokenLines; others: TokenLines } {
    let lastImportLineIndex = 0;
    for (let i = tokenLines.length - 1; i >= 0; i--) {
        const line = tokenLines[i];
        const token = line[1];
        if (token && token.types.includes('keyword') && token.content === 'import') {
            lastImportLineIndex = i + 1;
            break;
        }
    }
    const others = [...tokenLines];
    const imports = others.splice(0, lastImportLineIndex);
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
