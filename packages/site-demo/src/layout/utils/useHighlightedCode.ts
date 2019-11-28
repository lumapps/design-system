import { useMemo } from 'react';

import Prism from 'prismjs';

import 'prismjs/components/prism-typescript';

import 'prismjs/components/prism-jsx';

import 'prismjs/components/prism-tsx';

import 'prismjs/themes/prism-coy.css';

function useHighlightedCode(sourceCode: string, language: string): string {
    return useMemo(() => {
        if (!sourceCode || !language) {
            return null;
        }
        return Prism.highlight(sourceCode.trim(), Prism.languages[language], language);
    }, [sourceCode]);
}

export { useHighlightedCode };
