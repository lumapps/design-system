import type { CommonRef, HasDisabled, JSXElement, LumxClassName } from '../../types';
import { HasAriaDisabled, HasClassName } from '../../types';
import { classNames } from '../../utils';
import { ColorVariant, ColorWithVariants, Typography } from '../../constants';
import { resolveColorWithVariants } from '../../utils/_internal/color';
import { RawClickable } from '../RawClickable';

/**
 * Defines the props of the component.
 */
export interface LinkProps extends HasClassName, HasAriaDisabled, HasDisabled {
    /** Children content */
    children?: JSXElement;
    /** Color variant. */
    color?: ColorWithVariants;
    /** Lightened or darkened variant of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Link href. */
    href?: string;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Custom element/component for the link. */
    linkAs?: string | any;
    /** Click handler (framework wrappers convert onClick to handleClick). */
    handleClick?: (event: any) => void;
    /** Link target. */
    target?: string;
    /** Typography variant. */
    typography?: Typography;
    /** Element ref. */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Link';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-link';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<LinkProps> = {};

const { block } = classNames.bem(CLASSNAME);

/**
 * Link component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Link = (props: LinkProps) => {
    const {
        children,
        className,
        color: propColor,
        colorVariant: propColorVariant,
        typography,
        linkAs,
        handleClick,
        ref,
        href,
        ...forwardedProps
    } = props;

    const [color, colorVariant] = resolveColorWithVariants(propColor, propColorVariant);

    return RawClickable({
        ref,
        as: linkAs || (href ? 'a' : 'button'),
        href,
        ...forwardedProps,
        handleClick,
        children,
        className: classNames.join(
            className,
            block({
                [`color-${color}`]: Boolean(color),
                [`color-variant-${colorVariant}`]: Boolean(colorVariant),
                'has-typography': !!typography,
            }),
            typography && classNames.typography(typography),
        ),
    });
};
