import { ReactNode } from 'react';

import { GenericProps } from '@lumx/react/utils/type';
import {
    Toolbar as UI,
    ToolbarProps as UIProps,
    CLASSNAME,
    TOOLBAR_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Toolbar';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface ToolbarProps extends GenericProps, UIProps {
    /** After content (placed after the label). */
    after?: ReactNode;
    /** Before content (placed before the label). */
    before?: ReactNode;
    /** Label content. */
    label?: ReactNode;
}

/**
 * Toolbar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Toolbar = forwardRef<ToolbarProps, HTMLDivElement>((props, ref) => {
    return UI({
        ref,
        ...props,
    });
});
Toolbar.displayName = TOOLBAR_NAME;
Toolbar.className = CLASSNAME;
Toolbar.defaultProps = DEFAULT_PROPS;
