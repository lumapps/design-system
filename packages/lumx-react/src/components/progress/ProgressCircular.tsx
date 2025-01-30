import React from 'react';

import classNames from 'classnames';

import { Theme, Size } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Progress sizes.
 */
export type ProgressCircularSize = Extract<Size, 'xxs' | 'xs' | 's' | 'm'>;

/**
 * Defines the props of the component.
 */
export interface ProgressCircularProps extends GenericProps, HasTheme {
    /** Progress circular size. */
    size?: ProgressCircularSize;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressCircular';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressCircularProps> = {
    size: Size.m,
};

/**
 * ProgressCircularProps component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressCircular = forwardRef<ProgressCircularProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, theme = defaultTheme, size, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, size }))}
        >
            <div className="lumx-progress-circular__double-bounce1" />
            <div className="lumx-progress-circular__double-bounce2" />

            <svg className="lumx-progress-circular__svg" viewBox="25 25 50 50">
                <circle className="lumx-progress-circular__path" cx="50" cy="50" r="20" fill="none" strokeWidth="5" />
            </svg>
        </div>
    );
});
ProgressCircular.displayName = COMPONENT_NAME;
ProgressCircular.className = CLASSNAME;
ProgressCircular.defaultProps = DEFAULT_PROPS;
