import React, { ReactNode } from 'react';
import { RenderLineParams } from './types';

export const renderLines = ({ tokens, getLineProps, getTokenProps }: RenderLineParams): ReactNode =>
    tokens.map((line, i) => (
        <div key={line} {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
                <span key={token} {...getTokenProps({ token, key })} />
            ))}
        </div>
    ));
