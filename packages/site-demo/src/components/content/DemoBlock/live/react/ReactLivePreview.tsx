import React from 'react';
import { LiveContext } from '../LiveContext';

const LazyReactLiveError = React.lazy(() => import('react-live-runner').then((m) => ({ default: m.LiveError })));
const LazyReactLivePreview = React.lazy(() => import('react-live-runner').then((m) => ({ default: m.LivePreview })));

export function ReactLivePreview() {
    const context = React.useContext(LiveContext);
    const demo = context?.demo.react;
    const theme = context?.theme;
    if (!demo) return null;
    return (
        <>
            <React.Suspense fallback={<demo.default theme={theme} />}>
                <LazyReactLivePreview Component={React.Fragment} />
            </React.Suspense>
            <React.Suspense fallback={null}>
                <LazyReactLiveError style={{ color: '#C00', fontSize: '12px', padding: '10px', width: '100%' }} />
            </React.Suspense>
        </>
    );
}
