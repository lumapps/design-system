import React from 'react';
import type { Theme } from '@lumx/react';

import { theme as prismTheme } from '../../../CodeBlock/init-prism';
import type { ReactDemo } from '../../types';

export const LazyReactLiveProvider = React.lazy(() =>
    import('react-live-runner').then((m) => ({ default: m.LiveProvider })),
);

interface ReactLiveProviderProps extends Pick<ReactDemo, 'code' | 'scope'> {
    theme: Theme;
    children: React.ReactNode;
}

export function ReactLiveProvider({ theme, scope, code, children }: ReactLiveProviderProps) {
    const transformCode = React.useCallback((rawCode: string) => {
        let processed = rawCode;
        if (rawCode.includes('export default')) {
            processed = `${rawCode.replace(/export\s+default\s+/, 'const Demo = ')}; render(<Demo theme={theme} />);`;
        }
        return processed;
    }, []);
    const runnerScope = React.useMemo(() => ({ React, ...React, theme, ...scope }), [theme, scope]);
    return (
        <LazyReactLiveProvider theme={prismTheme} transformCode={transformCode} scope={runnerScope} code={code}>
            {children}
        </LazyReactLiveProvider>
    );
}
