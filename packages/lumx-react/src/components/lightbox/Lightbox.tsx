import { DOCUMENT } from '@lumx/react/constants';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/Lightbox';
import { IdsRegistryProvider } from '@lumx/react/utils/IdsRegistryContext';

import { LightboxContent, type LightboxProps } from './LightboxContent';

export type { LightboxProps };

/**
 * Lightbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Lightbox = forwardRef<LightboxProps, HTMLDivElement>((props, ref) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    return (
        <IdsRegistryProvider>
            <LightboxContent {...props} ref={ref} />
        </IdsRegistryProvider>
    );
});
Lightbox.displayName = COMPONENT_NAME;
Lightbox.className = CLASSNAME;
