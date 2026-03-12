import type { ColorVariant, ColorWithVariants, Typography } from '../../constants';
import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface InlineListProps extends HasClassName {
    /**
     * List items to render.
     */
    items?: JSXElement[];
    /**
     * Text color.
     */
    color?: ColorWithVariants;
    /**
     * Lightened or darkened variant of the selected color.
     */
    colorVariant?: ColorVariant;
    /**
     * Typography variant.
     */
    typography?: Typography;
    /**
     * Activate line wrap on overflow.
     */
    wrap?: boolean;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'InlineList';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-inline-list';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<InlineListProps> = {};

/**
 * InlineList component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const InlineList = (props: InlineListProps) => {
    const { className, color, colorVariant, typography, items = [], wrap, ref, ...forwardedProps } = props;
    return (
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ul
            {...forwardedProps}
            ref={ref}
            className={classNames.join(
                className,
                block({ wrap: Boolean(wrap) }),
                color && classNames.font(color, colorVariant),
                typography && classNames.typography(typography),
            )}
            // Lists with removed bullet style can lose their a11y list role on some browsers
            role="list"
        >
            {items.map((item, index) => (
                // We need to item is set as display: contents which removes the semantic.
                // eslint-disable-next-line jsx-a11y/no-redundant-roles
                <li key={index} role="listitem" className={element('item')}>
                    {index !== 0 && (
                        <span className={element('item-separator')} aria-hidden="true">
                            {'\u00A0•\u00A0'}
                        </span>
                    )}
                    {item}
                </li>
            ))}
        </ul>
    );
};

InlineList.displayName = COMPONENT_NAME;
InlineList.className = CLASSNAME;
InlineList.defaultProps = DEFAULT_PROPS;
