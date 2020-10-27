import classNames from 'classnames';
import isString from 'lodash/isString';
import Highlight, { Language, defaultProps } from 'prism-react-renderer';
import React from 'react';
import { theme } from './init-prism';
import { renderJSXLinesWithCollapsedImports } from './renderJSXLinesWithCollapsedImports';
import { RenderLineParams } from './types';

interface Props {
    /** Class name. */
    className?: string;
    /** Code in string format. */
    codeString?: string;
    /** Code language (tsx, jsx, etc.) */
    language?: Language | 'tsx';
}

export const renderLines = ({ tokens, getLineProps, getTokenProps }: RenderLineParams) =>
    tokens.map((line, i) => (
        <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
            ))}
        </div>
    ));

export const CodeBlock: React.FC<Props> = ({ className, codeString, language: propLanguage, children }) => {
    const language = propLanguage || className?.match(/language-(\w+)/)?.[1];
    if (!language) {
        return <pre className={classNames('code-block', className)}>{children || codeString}</pre>;
    }

    const code = (isString(children) ? children : codeString) || '';
    return (
        <Highlight {...defaultProps} theme={theme} code={code} language={language as Language}>
            {({ className: prismClassName, ...renderParams }) => (
                <pre className={classNames('code-block', prismClassName, className)}>
                    {language === 'jsx' || language === 'tsx'
                        ? renderJSXLinesWithCollapsedImports(renderParams)
                        : renderLines(renderParams)}
                </pre>
            )}
        </Highlight>
    );
};
