import { ReactNode } from 'react';

import classNames from 'classnames';

import { Kind, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { INPUT_HELPER_CONFIGURATION } from './constants';

/**
 * Defines the props of the component.
 */
export interface InputHelperProps extends GenericProps, HasTheme {
    /** Helper content. */
    children: string | ReactNode;
    /** Helper variant. */
    kind?: Kind;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'InputHelper';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-input-helper';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
};

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputHelper = forwardRef<InputHelperProps, HTMLParagraphElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { children, className, kind = DEFAULT_PROPS.kind, theme = defaultTheme, ...forwardedProps } = props;
    const { color } = INPUT_HELPER_CONFIGURATION[kind as any] || {};

    return (
        <p
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, theme }))}
        >
            {children}
        </p>
    );
});

InputHelper.displayName = COMPONENT_NAME;
InputHelper.className = CLASSNAME;
InputHelper.defaultProps = DEFAULT_PROPS;
