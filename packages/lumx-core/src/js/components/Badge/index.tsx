import { ColorPalette } from '../../constants';
import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface BadgeProps extends HasClassName {
    /** Badge content. */
    children?: JSXElement;
    /** Color variant. */
    color?: ColorPalette;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Badge';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-badge';

const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<BadgeProps> = {
    color: ColorPalette.primary,
};

/**
 * Badge component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Badge = (props: BadgeProps) => {
    const { children, className, color = DEFAULT_PROPS.color, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`color-${color}`]: Boolean(color),
                }),
            )}
        >
            {children}
        </div>
    );
};

Badge.displayName = COMPONENT_NAME;
Badge.className = CLASSNAME;
Badge.defaultProps = DEFAULT_PROPS;
