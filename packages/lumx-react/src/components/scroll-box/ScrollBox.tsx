import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    ScrollBox as UI,
    ScrollBoxProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/ScrollBox';
import { GenericProps } from '@lumx/core/js/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface ScrollBoxProps extends GenericProps, ReactToJSX<UIProps> {}

/**
 * ScrollBox component (internal, not exported from the package): a vertical flex box whose content scrolls on the y axis.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ScrollBox = forwardRef<ScrollBoxProps, HTMLDivElement>((props, ref) => {
    return UI({ ...props, ref });
});
ScrollBox.displayName = COMPONENT_NAME;
ScrollBox.className = CLASSNAME;
