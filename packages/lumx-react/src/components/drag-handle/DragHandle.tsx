import { GenericProps } from '@lumx/react/utils/type';
import {
    DragHandle as UI,
    DragHandleProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/DragHandle';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface DragHandleProps extends GenericProps, ReactToJSX<UIProps> {}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<DragHandleProps> = {};

/**
 * DragHandle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DragHandle = forwardRef<DragHandleProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme();
    const { theme = defaultTheme, ...otherProps } = props;

    return UI({
        ref,
        theme,
        ...otherProps,
    });
});
DragHandle.displayName = COMPONENT_NAME;
DragHandle.className = CLASSNAME;
DragHandle.defaultProps = DEFAULT_PROPS;
