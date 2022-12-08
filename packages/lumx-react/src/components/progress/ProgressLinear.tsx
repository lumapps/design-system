import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

export interface ProgressLinearProps extends GenericProps, HasTheme {}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressLinear';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressLinearProps> = {
    theme: Theme.light,
};

/**
 * ProgressLinear component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressLinear: Comp<ProgressLinearProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, theme, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
        >
            <div className="lumx-progress-linear__line1" />
            <div className="lumx-progress-linear__line2" />
        </div>
    );
});
ProgressLinear.displayName = COMPONENT_NAME;
ProgressLinear.className = CLASSNAME;
ProgressLinear.defaultProps = DEFAULT_PROPS;
