import type { LumxClassName, HasClassName, CommonRef, JSXElement, Elevation } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface CardProps extends HasClassName {
    /** Customize the rendered root element (e.g. `div`, `article`, `section`, `li`, `aside`), defaults to `div`. */
    as?: any;
    /** Content of the card. */
    children?: JSXElement;
    /** Elevation depth of the card, defaults to no elevation. */
    elevation?: Elevation;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Card';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-card';
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {
    as: 'div',
} as const;

/** Root element rendered when no `as` prop is provided. */
export type DefaultCardTag = typeof DEFAULT_PROPS.as;

/**
 * Card component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Card = (props: CardProps) => {
    const { className, children, elevation, ref, as: Element = DEFAULT_PROPS.as, ...forwardedProps } = props;

    return (
        <Element
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, block({ [`elevation-${elevation}`]: Boolean(elevation) }))}
        >
            {children}
        </Element>
    );
};
