import { GenericProps, getRootClassName } from '@lumx/react/utils';
import React, { useContext } from 'react';
import classNames from 'classnames';
import { IntersectionContext } from './intersection-context';

export interface DialogFooterProps extends GenericProps {
    /** Force divider to display event if there is no bottom intersection. */
    forceDivier?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DialogFooter';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

export const DialogFooter: React.FC<DialogFooterProps> = (props) => {
    const { forceDivider, children, className, ...forwardedProps } = props;
    const { intersections, sentinelBottom } = useContext(IntersectionContext);

    const hasBottomIntersection = sentinelBottom && !(intersections.get(sentinelBottom)?.isIntersecting ?? true);

    return (
        <footer
            {...forwardedProps}
            className={classNames(
                className,
                CLASSNAME,
                (forceDivider || hasBottomIntersection) && `${CLASSNAME}--has-divider`,
            )}
        >
            {children}
        </footer>
    );
};

DialogFooter.displayName = COMPONENT_NAME;
