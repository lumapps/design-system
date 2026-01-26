import React from 'react';
import once from 'lodash/once';
import type { SandpackCodeEditor, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';

type SandpackModule = {
    SandpackCodeEditor: typeof SandpackCodeEditor;
    SandpackPreview: typeof SandpackPreview;
    SandpackProvider: typeof SandpackProvider;
};

export const loadSandpack = once((): Promise<SandpackModule> => import('@codesandbox/sandpack-react'));

export const LazySandpackCodeEditor = React.lazy(() =>
    loadSandpack().then(({ SandpackCodeEditor }) => ({ default: SandpackCodeEditor })),
) as SandpackModule['SandpackCodeEditor'];

export const LazySandpackPreview = React.lazy(() =>
    loadSandpack().then(({ SandpackPreview }) => ({ default: SandpackPreview })),
) as SandpackModule['SandpackPreview'];

export const LazySandpackProvider = React.lazy(() =>
    loadSandpack().then(({ SandpackProvider }) => ({ default: SandpackProvider })),
) as SandpackModule['SandpackProvider'];
