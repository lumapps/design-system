import { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import type { LumxClassName } from '@lumx/core/js/types';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export interface BadgeWrapperProps extends GenericProps {
    /** Badge. */
    badge: ReactElement;
    /** Node to display the badge on */
    children: ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'BadgeWrapper';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-badge-wrapper';

export const BadgeWrapper = forwardRef<BadgeWrapperProps, HTMLDivElement>((props, ref) => {
    const { badge, children, className, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)}>
            {children}
            {badge && <div className={`${CLASSNAME}__badge`}>{badge}</div>}
        </div>
    );
});
BadgeWrapper.displayName = 'BadgeWrapper';
BadgeWrapper.className = CLASSNAME;
