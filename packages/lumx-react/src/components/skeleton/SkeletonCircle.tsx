import classNames from 'classnames';
import React, { forwardRef } from 'react';

import { GlobalSize, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SkeletonCircleProps extends GenericProps {
    /** Size variant. */
    size: GlobalSize;
    /** Theme. */
    theme?: Theme;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SkeletonCircle`;

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * SkeletonCircle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SkeletonCircle: Comp<SkeletonCircleProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, size, theme, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, size, theme }))}
        />
    );
});
SkeletonCircle.displayName = COMPONENT_NAME;
SkeletonCircle.className = CLASSNAME;
