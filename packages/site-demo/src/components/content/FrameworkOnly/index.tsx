import React from 'react';
import { useFramework, Framework } from '@lumx/demo/components/layout/FrameworkContext';

interface FrameworkOnlyProps {
    framework: Framework;
    children: React.ReactNode;
}

/** Render content only when framework is selected in FrameworkSelector */
export const FrameworkOnly: React.FC<FrameworkOnlyProps> = ({ framework, children }) => {
    const { framework: currentFramework } = useFramework();
    return currentFramework === framework ? <>{children}</> : null;
};
