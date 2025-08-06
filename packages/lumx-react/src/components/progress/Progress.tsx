import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';
import { GenericProps, HasTheme, ValueOf } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { ProgressLinear } from './ProgressLinear';
import { ProgressCircular } from './ProgressCircular';

/**
 * Progress variants.
 */
export const ProgressVariant = { linear: 'linear', circular: 'circular' } as const;
export type ProgressVariant = ValueOf<typeof ProgressVariant>;

/**
 * Defines the props of the component.
 */
export interface ProgressProps extends GenericProps, HasTheme {
    /** Progress variant. */
    variant?: ProgressVariant;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Progress';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressProps> = {
    variant: ProgressVariant.circular,
};

/**
 * Progress component.
 *
 * @deprecated use `ProgressLinear` and `ProgressCircular` instead.
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Progress = forwardRef<ProgressProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, theme = defaultTheme, variant = DEFAULT_PROPS.variant, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, variant }))}
        >
            {variant === ProgressVariant.circular && <ProgressCircular theme={theme} />}
            {variant === ProgressVariant.linear && <ProgressLinear theme={theme} />}
        </div>
    );
});
Progress.displayName = COMPONENT_NAME;
Progress.className = CLASSNAME;
Progress.defaultProps = DEFAULT_PROPS;
