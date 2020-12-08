import React, { ReactNode, Ref, SyntheticEvent, useMemo } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { ListProps, Size } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

/**
 *  Authorized size values.
 *  @deprecated use Size instead.
 */
export const ListItemSize = {
    big: Size.big,
    huge: Size.huge,
    regular: Size.regular,
    tiny: Size.tiny,
};

export type ListItemSizes = Size.tiny | Size.regular | Size.big | Size.huge;

/**
 * Defines the props of the component.
 */
export interface ListItemProps extends GenericProps {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** The children elements. */
    children: string | ReactNode;
    /** Whether the list item should be highlighted or not. */
    isHighlighted?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** The reference passed to the <li> element. */
    listItemRef?: Ref<HTMLLIElement>;
    /** Sets a custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** props that will be passed on to the Link */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** The reference passed to the <a> element. */
    linkRef?: Ref<HTMLAnchorElement>;
    /** The size variant of the component. */
    size?: ListItemSizes;
    /** The function called when an item is selected. */
    onItemSelected?(evt: SyntheticEvent): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListItem`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
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

export const ListItem: Comp<ListItemProps> = (props) => {
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
        listItemRef,
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
            {...forwardedProps}
            ref={listItemRef}
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
};
ListItem.displayName = COMPONENT_NAME;
ListItem.className = CLASSNAME;
ListItem.defaultProps = DEFAULT_PROPS;
