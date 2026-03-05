import { Size } from '../../constants';
import type { CommonRef, HasAriaDisabled, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { RawClickable } from '../RawClickable';

/** ListItem size variants. */
export type ListItemSize = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface ListItemProps extends HasClassName, HasAriaDisabled {
    /** A component to be rendered after the content. */
    after?: JSXElement;
    /** A component to be rendered before the content. */
    before?: JSXElement;
    /** Content. */
    children?: JSXElement;
    /** Whether the list item should be highlighted or not. */
    isHighlighted?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Whether link/button is disabled or not. */
    isDisabled?: boolean;
    /** Custom component for the link (can be used to inject router Link). */
    linkAs?: 'a' | any;
    /** Props that will be passed on to the Link. */
    linkProps?: Record<string, any>;
    /** Reference to the link element. */
    linkRef?: CommonRef;
    /** Size variant. */
    size?: ListItemSize;
    /** ref to the root <li> element */
    ref?: CommonRef;
    /** On click callback. */
    handleClick?: (event: any) => void;
}

export type ListItemPropsToOverride = 'after' | 'before' | 'children' | 'handleClick';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ListItem';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list-item';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ListItemProps> = {
    size: Size.regular,
};

/**
 * ListItem component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const ListItem = (props: ListItemProps) => {
    const {
        after,
        before,
        children,
        className,
        isHighlighted,
        isSelected,
        isDisabled,
        'aria-disabled': ariaDisabled,
        linkAs,
        linkProps = {},
        linkRef,
        handleClick,
        size = DEFAULT_PROPS.size,
        ref,
        ...forwardedProps
    } = props;
    const clickable = !!linkAs || linkProps?.href || handleClick;

    return (
        <li
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, block({ [`size-${size}`]: Boolean(size) }))}
        >
            {RawClickable({
                as: clickable ? linkAs || (linkProps.href ? 'a' : 'button') : 'div',
                isDisabled,
                'aria-disabled': ariaDisabled,
                ...linkProps,
                className: classNames.join(
                    element(clickable ? 'link' : 'wrapper', {
                        'is-highlighted': isHighlighted,
                        'is-selected': isSelected,
                    }),
                ),
                handleClick,
                ref: linkRef,
                children: (
                    <>
                        {before && <div className={element('before')}>{before}</div>}
                        <div className={element('content')}>{children}</div>
                        {after && <div className={element('after')}>{after}</div>}
                    </>
                ) as unknown as JSXElement,
            })}
        </li>
    );
};

ListItem.displayName = COMPONENT_NAME;
ListItem.className = CLASSNAME;
ListItem.defaultProps = DEFAULT_PROPS;
