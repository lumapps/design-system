import { ReactElement, ReactNode } from 'react';

import {
    BadgeWrapper as UI,
    BadgeWrapperProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Badge/BadgeWrapper';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export interface BadgeWrapperProps extends GenericProps, Omit<UIProps, 'children' | 'badge'> {
    /** Badge element to display */
    badge: ReactElement;
    /** Content to wrap with badge */
    children: ReactNode;
}

export const BadgeWrapper = forwardRef<BadgeWrapperProps, HTMLDivElement>((props, ref) => {
    return UI({ ...props, ref });
});
BadgeWrapper.displayName = COMPONENT_NAME;
BadgeWrapper.className = CLASSNAME;
