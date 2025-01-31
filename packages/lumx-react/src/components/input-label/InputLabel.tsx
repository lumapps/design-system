import { ReactNode } from 'react';

import classNames from 'classnames';

import { Theme, Typography } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses, getTypographyClassName } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

/**
 * Defines the props of the component.
 */
export interface InputLabelProps extends GenericProps, HasTheme {
    /** Typography variant. */
    typography?: Typography;
    /** Label content. */
    children: string | ReactNode;
    /** Native htmlFor property. */
    htmlFor: string;
    /** Whether the component is required or not. */
    isRequired?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'InputLabel';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-input-label';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputLabelProps> = {};

/**
 * InputLabel component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputLabel = forwardRef<InputLabelProps, HTMLLabelElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { children, className, htmlFor, isRequired, theme = defaultTheme, typography, ...forwardedProps } = props;
    const typographyClass = typography && getTypographyClassName(typography);

    return (
        <label
            ref={ref}
            {...forwardedProps}
            htmlFor={htmlFor}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, isRequired, theme, hasCustomTypography: Boolean(typography) }),
                typographyClass,
            )}
        >
            {children}
        </label>
    );
});
InputLabel.displayName = COMPONENT_NAME;
InputLabel.className = CLASSNAME;
InputLabel.defaultProps = DEFAULT_PROPS;
