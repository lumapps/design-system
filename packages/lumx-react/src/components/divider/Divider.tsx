import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { Divider as UI, DividerProps as UIProps, CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/Divider';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface DividerProps extends GenericProps, UIProps {}

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
    const { theme = defaultTheme, ...otherProps } = props;

    return UI({
        ref,
        theme,
        ...otherProps,
    });
});
Divider.displayName = COMPONENT_NAME;
Divider.className = CLASSNAME;
Divider.defaultProps = DEFAULT_PROPS;
