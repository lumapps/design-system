import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { ColorPalette } from '@lumx/react';
import type { GenericProps, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
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
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-badge';

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
    const { children, className, color, ...forwardedProps } = props;
    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color }))}
        >
            {children}
        </div>
    );
});
Badge.displayName = COMPONENT_NAME;
Badge.className = CLASSNAME;
Badge.defaultProps = DEFAULT_PROPS;
