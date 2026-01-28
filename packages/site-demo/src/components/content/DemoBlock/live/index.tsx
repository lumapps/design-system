import React from 'react';
import type { Theme } from '@lumx/react';

import { useFramework } from '@lumx/demo/components/layout/FrameworkContext';
import { CodeBlock } from '@lumx/demo/components/content/CodeBlock/CodeBlock';
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
    const { framework } = useFramework();
    const context = React.useContext(LiveContext);
    const demo = context?.demo;

    // Show Vue code if Vue framework is selected and Vue demo exists, otherwise show React
    if (framework === 'vue' && demo?.vue) {
        return <CodeBlock className="demo-block__code-part" language="markup" codeString={demo.vue.default} />;
    }

    // Fall back to React editor
    return <ReactLiveEditor />;
}

export function LivePreview() {
    return <ReactLivePreview />;
}
