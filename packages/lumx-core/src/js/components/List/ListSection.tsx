import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';
import { TextProps } from '../Text';

/**
 * Defines the props of the component.
 */
export interface ListSectionProps extends HasClassName {
    /** Section label displayed as the group title. Accepts a plain string or custom JSX content. */
    label?: string | JSXElement;
    /** Section icon */
    icon?: string;
    /** List items (should be ListItem, ListDivider, etc.). */
    children: JSXElement;
    /** Items wrapper forwarded props */
    itemsWrapperProps?: Record<string, any>;
    /** ID for the label element (used for aria-labelledby). */
    id: string;
    /** ref to the root element */
    ref?: CommonRef;
    /** Text component to use for rendering the label */
    Text: (props: TextProps & Record<string, any>) => any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ListSection';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list-section';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ListSectionProps> = {};

/**
 * ListSection component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const ListSection = (props: ListSectionProps) => {
    const { children, className, label, icon, itemsWrapperProps, id, ref, Text, ...forwardedProps } = props;
    const labelId = `${id}-label`;
    const hasHeader = !!label;

    return (
        <li ref={ref} {...forwardedProps} className={classNames.join(className, block())}>
            {hasHeader && (
                <Text as="p" typography="overline" className={element('title')} id={labelId}>
                    {icon && Icon({ icon })}
                    {label}
                </Text>
            )}
            <ul {...itemsWrapperProps} className={element('items')} aria-labelledby={hasHeader ? labelId : undefined}>
                {children}
            </ul>
        </li>
    );
};

ListSection.displayName = COMPONENT_NAME;
ListSection.className = CLASSNAME;
ListSection.defaultProps = DEFAULT_PROPS;
