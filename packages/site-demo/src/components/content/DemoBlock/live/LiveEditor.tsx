import React from 'react';
import upperFirst from 'lodash/upperFirst';

import { Message } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';
import { useFramework } from '@lumx/demo/components/layout/FrameworkContext';

import { useLiveContext } from './LiveContext';
import { CodeBlock } from '../../CodeBlock/CodeBlock';
import { LazySandpackCodeEditor } from './sandpack';

/**
 * Display source code in view mode or in editor
 */
export const LiveEditor: React.FC = () => {
    const { demo, isEditMode } = useLiveContext();
    const { framework } = useFramework();
    const sourceCode = demo[framework]?.sourceCode;
    const language = framework === 'vue' ? 'markup' : 'tsx';

    if (!sourceCode) {
        return (
            <Message kind="warning" className={classNames.margin('big')}>
                No available demo in {upperFirst(framework)} yet
            </Message>
        );
    }

    const codeBlock = <CodeBlock codeString={sourceCode} language={language} disableCollapseImports />;

    return (
        <React.Suspense fallback={codeBlock}>
            {isEditMode ? <LazySandpackCodeEditor wrapContent /> : codeBlock}
        </React.Suspense>
    );
};
