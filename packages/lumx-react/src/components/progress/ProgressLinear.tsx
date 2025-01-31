import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';
import type { GenericProps, HasTheme, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export interface ProgressLinearProps extends GenericProps, HasTheme {}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressLinear';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-progress-linear';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressLinearProps> = {};

/**
 * ProgressLinear component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressLinear = forwardRef<ProgressLinearProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, theme = defaultTheme, ...forwardedProps } = props;

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
