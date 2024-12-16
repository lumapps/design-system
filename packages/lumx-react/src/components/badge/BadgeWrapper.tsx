import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { DEFAULT_PROPS } from '@lumx/react/components/select/WithSelectContext';
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

export const BadgeWrapper = forwardRef<BadgeWrapperProps, HTMLDivElement>((props, ref) => {
    const { badge, children, className, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
            {children}
            {badge && <div className={`${CLASSNAME}__badge`}>{badge}</div>}
        </div>
    );
});
BadgeWrapper.displayName = 'BadgeWrapper';
BadgeWrapper.className = CLASSNAME;
BadgeWrapper.defaultProps = DEFAULT_PROPS;
