import { ReactNode } from 'react';
import { RenderLineParams } from './types';

export const renderLines = ({ tokens, getLineProps, getTokenProps }: RenderLineParams): ReactNode =>
    tokens.map((line, i) => (
        <div {...getLineProps({ line, key: i })} key={i}>
            {line.map((token, key) => (
                <code {...getTokenProps({ token, key })} key={key} />
            ))}
        </div>
    ));
