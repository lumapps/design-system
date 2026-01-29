import React from 'react';
import { type Theme, Message } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';

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

    // Vue demo
    if (framework === 'vue') {
        const codeString = demo?.vue?.default?.trim();
        if (codeString) {
            return <CodeBlock className="demo-block__code-part" language="markup" codeString={codeString} />;
        }
        return (
            <Message kind="warning" className={classNames.margin('all', 'big')}>
                Vue demo is not available yet.
            </Message>
        );
    }

    // Fall back to React editor
    return <ReactLiveEditor />;
}

export function LivePreview() {
    return <ReactLivePreview />;
}
