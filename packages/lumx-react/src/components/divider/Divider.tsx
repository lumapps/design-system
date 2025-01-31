import classNames from 'classnames';

import { Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface DividerProps extends GenericProps, HasTheme {}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Divider';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-divider';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<DividerProps> = {};

/**
 * Divider component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Divider = forwardRef<DividerProps, HTMLHRElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, theme = defaultTheme, ...forwardedProps } = props;

    return (
        <hr
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
        />
    );
});
Divider.displayName = COMPONENT_NAME;
Divider.className = CLASSNAME;
Divider.defaultProps = DEFAULT_PROPS;
