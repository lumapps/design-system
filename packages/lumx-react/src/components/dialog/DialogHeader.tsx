import React, { useContext } from 'react';
import { GenericProps, getRootClassName } from '@lumx/react/utils';
import classNames from 'classnames';
import { IntersectionContext } from './intersection-context';

export interface DialogHeaderProps extends GenericProps {
    /** Force divider to display event if there is no bottom intersection. */
    forceDivier?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DialogHeader';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

export const DialogHeader: React.FC<DialogHeaderProps> = (props) => {
    const { forceDivider, className, children, ...forwardedProps } = props;
    const { intersections, sentinelTop } = useContext(IntersectionContext);

    const hasTopIntersection = sentinelTop && !(intersections.get(sentinelTop)?.isIntersecting ?? true);

    return (
        <header
            {...forwardedProps}
            className={classNames(
                className,
                CLASSNAME,
                (forceDivider || hasTopIntersection) && `${CLASSNAME}--has-divider`,
            )}
        >
            {children}
        </header>
    );
};

DialogHeader.displayName = COMPONENT_NAME;
