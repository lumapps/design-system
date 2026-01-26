import React from 'react';
import { Framework } from '../../layout/FrameworkContext';

/** Map of @lumx/demo import paths to their source code */
export type localImports = Record<string, string>;

export interface Demo {
    default?: React.FC<any>;
    sourceCode: string;
    localImports: localImports;
}

export type Demos = {
    [framework in Framework]: Demo;
};
