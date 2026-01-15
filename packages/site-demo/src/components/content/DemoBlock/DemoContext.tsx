import React, { createContext, useContext } from 'react';

export interface DemoData {
    relativePath: string;
}

const DemoContext = createContext<Record<string, DemoData>>({});

export const DemoProvider: React.FC<{ demos: Record<string, DemoData>; children: React.ReactNode }> = ({
    demos,
    children,
}) => {
    return <DemoContext.Provider value={demos || {}}>{children}</DemoContext.Provider>;
};

export const useDemos = () => useContext(DemoContext);
