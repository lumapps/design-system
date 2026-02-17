import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    ProgressLinear as ProgressLinearUI,
    ProgressLinearProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/ProgressLinear';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface ProgressLinearProps extends GenericProps, ReactToJSX<UIProps> {}

/**
 * ProgressLinear component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressLinear = forwardRef<ProgressLinearProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, ...otherProps } = props;

    return ProgressLinearUI({
        ref,
        theme,
        ...otherProps,
    });
});
ProgressLinear.displayName = COMPONENT_NAME;
ProgressLinear.className = CLASSNAME;
ProgressLinear.defaultProps = DEFAULT_PROPS;
