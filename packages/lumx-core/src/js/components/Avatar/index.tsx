import type { HasClassName, JSXElement, LumxClassName, HasTheme, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { Size } from '../../constants';

/**
 * Avatar sizes.
 */
export type AvatarSize = Extract<Size, 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface AvatarProps extends HasTheme, HasClassName {
    /** Action toolbar content. */
    actions?: JSXElement;
    /** Badge. */
    badge?: JSXElement;
    /** Image URL. */
    image: JSXElement;
    /** Size variant. */
    size?: AvatarSize;
    /** Props to pass to the thumbnail (minus those already set by the Avatar props). */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Avatar';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-avatar';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {
    size: Size.m,
} as const;

/**
 * Avatar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Avatar = (props: AvatarProps) => {
    const { actions, badge, className, image, size = DEFAULT_PROPS.size, theme, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`size-${size}`]: Boolean(size),
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            {image}
            {actions && <div className={element('actions')}>{actions}</div>}
            {badge && <div className={element('badge')}>{badge}</div>}
        </div>
    );
};
