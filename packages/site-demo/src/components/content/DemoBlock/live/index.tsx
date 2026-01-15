import React from 'react';
import type { Theme } from '@lumx/react';

import { ReactLiveEditor, ReactLivePreview, ReactLiveProvider } from './react';
import { Demo } from '../types';
import { LiveContext } from './LiveContext';

export function LiveProvider({ demo, children, theme }: { theme: Theme; demo: Demo; children: React.ReactNode }) {
    const [value] = React.useState(() => ({ demo, theme }));
    return (
        <React.Suspense fallback={<>{children}</>}>
            <LiveContext.Provider value={value}>
                {demo.react && (
                    <ReactLiveProvider scope={demo.react.scope} code={demo.react.code} theme={theme}>
                        {children}
                    </ReactLiveProvider>
                )}
            </LiveContext.Provider>
        </React.Suspense>
    );
}

export function LiveEditor() {
    return <ReactLiveEditor />;
}

export function LivePreview() {
    return <ReactLivePreview />;
}
