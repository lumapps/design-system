import React, { createContext, useContext, useState } from 'react';

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

/**
 * Framework context provider
 * (store currently selected framework)
 */
export const FrameworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [framework, setFramework] = useState<Framework>(Framework.react);

    React.useEffect(() => {
        const stored = global?.localStorage?.getItem(STORAGE_KEY) as null | Framework;
        if (stored) setFramework(stored);
    }, []);

    const value = React.useMemo<FrameworkContextValue>(
        () => ({
            framework,
            setFramework(newFramework) {
                global?.localStorage?.setItem(STORAGE_KEY, newFramework);
                setFramework(newFramework);
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
