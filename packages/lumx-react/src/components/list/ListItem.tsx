import { ReactNode, Ref, SyntheticEvent } from 'react';

import isEmpty from 'lodash/isEmpty';

import { ListProps, Size } from '@lumx/react';
import { GenericProps, HasAriaDisabled } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { RawClickable } from '@lumx/core/js/components/RawClickable';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

export type ListItemSize = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface ListItemProps extends GenericProps, HasAriaDisabled {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** Content. */
    children: string | ReactNode;
    /** Whether the list item should be highlighted or not. */
    isHighlighted?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Whether link/button is disabled or not. */
    isDisabled?: boolean;
    /** Reference to the <li> element. */
    listItemRef?: Ref<HTMLLIElement>;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Props that will be passed on to the Link */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Reference to the link element. */
    linkRef?: Ref<HTMLAnchorElement>;
    /** Size variant. */
    size?: ListItemSize;

    /** On selected callback. */
    onItemSelected?(evt: SyntheticEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ListItem';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list-item';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ListProps> = {
    size: Size.regular,
};

/**
 * Check if the list item is clickable.
 * @return `true` if the list item is clickable; `false` otherwise.
 */
export function isClickable({ linkAs, linkProps, onItemSelected }: Partial<ListItemProps>): boolean {
    return !!linkAs || !isEmpty(linkProps?.href) || !!onItemSelected;
}

/**
 * ListItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListItem = forwardRef<ListItemProps, HTMLLIElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        after,
        before,
        children,
        className,
        isHighlighted,
        isSelected,
        linkAs,
        linkProps = {},
        linkRef,
        onItemSelected,
        size = DEFAULT_PROPS.size,
        ...forwardedProps
    } = otherProps;

    const clickable = isClickable({ linkAs, linkProps, onItemSelected });

    return (
        <li
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, block({ [`size-${size}`]: Boolean(size) }))}
        >
            {RawClickable({
                as: clickable ? linkAs || (linkProps.href ? 'a' : 'button') : 'div',
                ...disabledStateProps,
                ...linkProps,
                className: classNames.join(
                    element(clickable ? 'link' : 'wrapper', {
                        'is-highlighted': isHighlighted,
                        'is-selected': isSelected,
                        'is-disabled': isAnyDisabled,
                    }),
                ),
                handleClick: onItemSelected,
                ref: linkRef,
                children: (
                    <>
                        {before && <div className={element('before')}>{before}</div>}
                        <div className={element('content')}>{children}</div>
                        {after && <div className={element('after')}>{after}</div>}
                    </>
                ),
            })}
        </li>
    );
});
ListItem.displayName = COMPONENT_NAME;
ListItem.className = CLASSNAME;
ListItem.defaultProps = DEFAULT_PROPS;
