import React from 'react';
import { CodeBlock } from '../../../CodeBlock/CodeBlock';
import { LiveContext } from '../LiveContext';

export const LazyReactLiveEditor = React.lazy(() =>
    import('react-live-runner').then((m) => ({ default: m.LiveEditor })),
);

export function ReactLiveEditor() {
    const context = React.useContext(LiveContext);
    const demo = context?.demo?.react;
    if (!demo) return null;

    return (
        <>
            {demo.imports && <CodeBlock className="demo-block__code-part" language="tsx" codeString={demo.imports} />}
            <React.Suspense fallback={<CodeBlock codeString={demo.code} language="tsx" />}>
                <CodeBlock as="div" className="demo-block__code-part demo-block__code-part--editable">
                    <LazyReactLiveEditor />
                </CodeBlock>
            </React.Suspense>
        </>
    );
}
