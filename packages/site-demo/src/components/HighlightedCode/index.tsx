import Highlight, { defaultProps } from 'prism-react-renderer';
import React from 'react';
import { theme } from './init-prism';

interface Props {
    /** Code in string format. */
    codeString: string;
    /** Code language (tsx, jsx, etc.) */
    language: string;
}

export const HighlightedCode: React.FC<Props> = ({ codeString, language }: any) => (
    <Highlight {...defaultProps} theme={theme} code={codeString} language={language}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
            <pre className={className}>
                {tokens.map((line, i) => {
                    return (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    );
                })}
            </pre>
        )}
    </Highlight>
);
