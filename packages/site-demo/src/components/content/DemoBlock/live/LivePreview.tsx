import React from 'react';

import { FlexBox, HasClassName } from '@lumx/react';
import { PortalInit, PortalProvider } from '@lumx/react/utils';
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
    const portalRef = React.useRef<HTMLDivElement>(null);
    const initPortal = React.useCallback<PortalInit>(() => ({ container: portalRef.current || undefined }), []);

    return (
        <div className={block([className as string])}>
            {DemoComponent ? (
                <div className={element('static')} {...demoProps}>
                    <PortalProvider value={initPortal}>
                        <FlexBox {...flexBoxProps}>
                            <DemoComponent theme={theme} />
                        </FlexBox>
                    </PortalProvider>
                    <div ref={portalRef} />
                </div>
            ) : null}
            <React.Suspense>{isEditMode ? <LazySandpackPreview /> : null}</React.Suspense>
        </div>
    );
}
