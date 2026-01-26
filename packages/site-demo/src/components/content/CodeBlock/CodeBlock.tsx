import classNames from 'classnames';
import isString from 'lodash/isString';
import prismTheme from 'prism-react-renderer/themes/github';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import React from 'react';
import { renderJSXLinesWithCollapsedImports } from './renderJSXLinesWithCollapsedImports';
import { renderLines } from './renderLines';

import './CodeBlock.scss';

interface Props {
    /** Class name. */
    className?: string;
    /** Code in string format. */
    codeString?: string;
    /** Code language (tsx, jsx, etc.) */
    language?: Language | 'tsx';
    /** Code */
    children?: React.ReactNode;
    /** Render as */
    as?: 'pre' | 'div';
    /** Disables import collapse */
    disableCollapseImports?: boolean;
}

/** Display syntax highlighted code */
export const CodeBlock: React.FC<Props> = ({
    as: Component = 'pre',
    className,
    codeString,
    language: propLanguage,
    children,
    disableCollapseImports,
}) => {
    const language = propLanguage || className?.match(/language-(\w+)/)?.[1];
    if (!language) {
        return <Component className={classNames('code-block', className)}>{children || codeString}</Component>;
    }

    const code = (isString(children) ? children : codeString) || '';
    return (
        <Highlight {...defaultProps} theme={prismTheme} code={code} language={language as Language}>
            {({ className: prismClassName, ...renderParams }) => (
                <Component className={classNames('code-block', prismClassName, className)}>
                    {!disableCollapseImports && (language === 'jsx' || language === 'tsx')
                        ? renderJSXLinesWithCollapsedImports(renderParams)
                        : renderLines(renderParams)}
                </Component>
            )}
        </Highlight>
    );
};
