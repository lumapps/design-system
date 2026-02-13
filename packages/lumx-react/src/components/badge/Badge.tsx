import { ReactNode } from 'react';

import { Badge as UI, BadgeProps as UIProps } from '@lumx/core/js/components/Badge';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface BadgeProps extends Omit<UIProps, 'children'>, GenericProps {
    /** Badge content. */
    children?: ReactNode;
}

/**
 * Badge component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Badge = forwardRef<BadgeProps, HTMLDivElement>((props, ref) => {
    return UI({ ...props, ref });
});

Badge.displayName = UI.displayName;
Badge.className = UI.className;
Badge.defaultProps = UI.defaultProps;
