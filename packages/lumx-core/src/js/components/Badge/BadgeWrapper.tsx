import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

export interface BadgeWrapperProps extends HasClassName {
    /** Badge element to display */
    badge?: JSXElement;
    /** Content to wrap with badge */
    children?: JSXElement;
    /** Ref forwarding */
    ref?: CommonRef;
}

export const COMPONENT_NAME = 'BadgeWrapper';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-badge-wrapper';
export const DEFAULT_PROPS: Partial<BadgeWrapperProps> = {};

const { block, element } = classNames.bem(CLASSNAME);

export const BadgeWrapper = (props: BadgeWrapperProps) => {
    const { badge, children, className, ref, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, block())}>
            {children}
            {badge && <div className={element('badge')}>{badge}</div>}
        </div>
    );
};
