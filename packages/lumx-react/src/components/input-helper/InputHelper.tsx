import React, { ReactNode } from 'react';

import { Theme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    getProps,
    InputHelperProps as BaseInputHelperProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    UI,
} from '@lumx/core/components/input-helper';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

/**
 * Defines the props of the component.
 */
export interface InputHelperProps extends BaseInputHelperProps {
    /** Helper content. */
    children: string | ReactNode;
}

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputHelper = forwardRef<InputHelperProps, HTMLParagraphElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { children, theme = defaultTheme, ...forwardedProps } = props;
    const { className: rootClassName } = getProps({ ...props, theme });

    return (
        <UI ref={ref} {...forwardedProps} className={rootClassName}>
            {children}
        </UI>
    );
});

InputHelper.displayName = COMPONENT_NAME;
InputHelper.className = CLASSNAME;
InputHelper.defaultProps = DEFAULT_PROPS;
