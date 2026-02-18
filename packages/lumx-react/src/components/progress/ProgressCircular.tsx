import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    ProgressCircular as ProgressCircularUI,
    ProgressCircularProps as UIProps,
    ProgressCircularSize,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    element,
} from '@lumx/core/js/components/ProgressCircular';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface ProgressCircularProps extends GenericProps, ReactToJSX<UIProps> {}

export type { ProgressCircularSize };

/**
 * ProgressCircular component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressCircular = forwardRef<ProgressCircularProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, ...otherProps } = props;

    return ProgressCircularUI({
        ref,
        theme,
        ...otherProps,
        circleProps: {
            className: element('path'),
            strokeWidth: '5',
        },
        svgProps: {
            className: element('svg'),
        },
    });
});
ProgressCircular.displayName = COMPONENT_NAME;
ProgressCircular.className = CLASSNAME;
ProgressCircular.defaultProps = DEFAULT_PROPS;
