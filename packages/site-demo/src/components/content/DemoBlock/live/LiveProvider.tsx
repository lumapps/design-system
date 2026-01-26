import React, { useMemo } from 'react';

import { useLocation } from '@gatsbyjs/reach-router';

import { useFramework } from '@lumx/demo/components/layout/FrameworkContext';
import { useLumxVersion } from '@lumx/demo/utils/hooks/useLumxVersion';

import { LiveContext, LiveContextType } from './LiveContext';
import { LazySandpackProvider } from './sandpack';
import { SETUP } from './setup';

function useFrontVersion(): string {
    const location = useLocation();
    const defaultVersion = useLumxVersion();
    return useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('frontVersion') ?? defaultVersion;
    }, [location.search, defaultVersion]);
}

interface LiveProviderProps extends LiveContextType {
    children: React.ReactNode;
}

/**
 * Live demo context provider
 */
export function LiveProvider({ demo, children, theme, isEditMode, flexBoxProps }: LiveProviderProps) {
    const value = useMemo(() => ({ demo, theme, isEditMode, flexBoxProps }), [demo, theme, isEditMode, flexBoxProps]);
    const { framework } = useFramework();
    const frontVersion = useFrontVersion();

    const editConfig = useMemo(
        () => (demo[framework]?.sourceCode ? SETUP[framework](demo[framework], flexBoxProps, frontVersion) : null),
        [framework, demo, flexBoxProps, frontVersion],
    );

    return (
        <LiveContext.Provider value={value}>
            <React.Suspense fallback={children}>
                {editConfig && isEditMode ? (
                    <LazySandpackProvider key={framework} {...editConfig}>
                        {children}
                    </LazySandpackProvider>
                ) : (
                    children
                )}
            </React.Suspense>
        </LiveContext.Provider>
    );
}
