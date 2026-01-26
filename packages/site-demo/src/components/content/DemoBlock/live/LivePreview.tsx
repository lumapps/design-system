import React from 'react';

import { FlexBox, HasClassName } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';

import { useLiveContext } from './LiveContext';
import { LazySandpackPreview } from './sandpack';

const { block, element } = classNames.bem('live-preview');

/**
 * Display demo component or the live preview
 */
export function LivePreview({ className }: HasClassName) {
    const { demo, theme, isEditMode, flexBoxProps } = useLiveContext();
    const DemoComponent = demo?.react?.default;
    const demoProps: any = isEditMode ? { inert: 'true', style: { visibility: 'hidden' } } : undefined;

    return (
        <div className={block([className as string])}>
            {DemoComponent ? (
                <div className={element('static')} {...demoProps}>
                    <FlexBox {...flexBoxProps}>
                        <DemoComponent theme={theme} />
                    </FlexBox>
                </div>
            ) : null}
            <React.Suspense>{isEditMode ? <LazySandpackPreview /> : null}</React.Suspense>
        </div>
    );
}
