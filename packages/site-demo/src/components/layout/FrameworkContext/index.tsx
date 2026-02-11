import React, { createContext, useContext, useState } from 'react';

import { startViewTransition } from '@lumx/react/utils/browser/DOM/startViewTransition';

export enum Framework {
    react = 'react',
    vue = 'vue',
}

interface FrameworkContextValue {
    framework: Framework;
    setFramework: (framework: Framework) => void;
}

const FrameworkContext = createContext<FrameworkContextValue | null>(null);
const STORAGE_KEY = 'lumx-framework-selector';
const FRAMEWORK_PARAM = 'framework';

/**
 * Framework context provider
 * (store currently selected framework)
 */
export const FrameworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [framework, setFramework] = useState<Framework>(Framework.react);

    React.useEffect(() => {
        // URL search param takes precedence over localStorage
        const urlParam = new URLSearchParams(global?.location?.search).get(FRAMEWORK_PARAM);
        if (urlParam && urlParam in Framework) {
            setFramework(urlParam as Framework);
            global?.localStorage?.setItem(STORAGE_KEY, urlParam);
            return;
        }
        const stored = global?.localStorage?.getItem(STORAGE_KEY) as null | Framework;
        if (stored) setFramework(stored);
    }, []);

    const value = React.useMemo<FrameworkContextValue>(
        () => ({
            framework,
            setFramework(newFramework) {
                // Persist in local storage
                global?.localStorage?.setItem(STORAGE_KEY, newFramework);

                // Persist in URL (temporarily)
                const url = new URL(global.location.href);
                url.searchParams.set(FRAMEWORK_PARAM, framework);
                global.history.replaceState({}, '', url.toString());

                // Animate change of framework
                startViewTransition({
                    changes: () => setFramework(newFramework),
                });
            },
        }),
        [framework, setFramework],
    );

    return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>;
};

/**
 * Framework context value hook
 */
export const useFramework = () => {
    const context = useContext(FrameworkContext);
    if (!context) {
        throw new Error('useFramework must be used within a FrameworkProvider');
    }
    return context;
};
