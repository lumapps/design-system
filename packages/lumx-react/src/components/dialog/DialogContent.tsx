import React, { forwardRef, useContext } from 'react';
import classNames from 'classnames';
import { GenericProps, getRootClassName } from '@lumx/react/utils';
import { IntersectionContext } from './intersection-context';

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DialogContent';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

export const DialogContent = forwardRef<HTMLDivElement, GenericProps>((props, ref) => {
    const { className, children, ...forwardedProps } = props;
    const { setSentinelTop, setSentinelBottom } = useContext(IntersectionContext);

    return (
        <div ref={ref} className={classNames(CLASSNAME, className)} {...forwardedProps}>
            <div className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--top`} ref={setSentinelTop} />

            {children}

            <div className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--bottom`} ref={setSentinelBottom} />
        </div>
    );
});

DialogContent.displayName = 'DialogContent';
