import { ReactNode } from 'react';

import { ColorPalette } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface BadgeProps extends GenericProps {
    /** Badge content. */
    children?: ReactNode;
    /** Color variant. */
    color?: ColorPalette;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Badge';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-badge';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<BadgeProps> = {
    color: ColorPalette.primary,
};

/**
 * Badge component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Badge = forwardRef<BadgeProps, HTMLDivElement>((props, ref) => {
    const { children, className, color = DEFAULT_PROPS.color, ...forwardedProps } = props;
    const { block } = useClassnames(CLASSNAME);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={block(
                {
                    [`color-${color}`]: Boolean(color),
                },
                className,
            )}
        >
            {children}
        </div>
    );
});
Badge.displayName = COMPONENT_NAME;
Badge.className = CLASSNAME;
Badge.defaultProps = DEFAULT_PROPS;
