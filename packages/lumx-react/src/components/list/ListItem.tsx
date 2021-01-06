import React, { forwardRef, ReactNode, Ref, SyntheticEvent, useMemo } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { ListProps, Size } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

export type ListItemSize = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface ListItemProps extends GenericProps {
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
export function isClickable({ linkProps, onItemSelected }: Partial<ListItemProps>): boolean {
    return !isEmpty(linkProps?.href) || !!onItemSelected;
}

/**
 * ListItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListItem: Comp<ListItemProps, HTMLLIElement> = forwardRef((props, ref) => {
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
        size,
        ...forwardedProps
    } = props;
    const onKeyDown = useMemo(() => (onItemSelected ? onEnterPressed(onItemSelected as any) : undefined), [
        onItemSelected,
    ]);

    const content = (
        <>
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            <div className={`${CLASSNAME}__content`}>{children}</div>
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </>
    );

    return (
        <li
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    size,
                }),
            )}
        >
            {isClickable({ linkProps, onItemSelected }) ? (
                /* Clickable list item */
                renderLink(
                    {
                        linkAs,
                        tabIndex: 0,
                        role: onItemSelected ? 'button' : undefined,
                        ...linkProps,
                        className: classNames(
                            handleBasicClasses({
                                prefix: `${CLASSNAME}__link`,
                                isHighlighted,
                                isSelected,
                            }),
                        ),
                        onClick: onItemSelected,
                        onKeyDown,
                        ref: linkRef,
                    },
                    content,
                )
            ) : (
                /* Non clickable list item */
                <div className={`${CLASSNAME}__wrapper`}>{content}</div>
            )}
        </li>
    );
});
ListItem.displayName = COMPONENT_NAME;
ListItem.className = CLASSNAME;
ListItem.defaultProps = DEFAULT_PROPS;
