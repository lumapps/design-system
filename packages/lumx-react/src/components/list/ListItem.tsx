import React, { ReactElement, ReactNode, Ref, useMemo } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { ListProps, Size } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

/**
 *  Authorized size values.
 *  @deprecated use Size instead.
 */
const ListItemSize = {
    big: Size.big,
    huge: Size.huge,
    regular: Size.regular,
    tiny: Size.tiny,
};

type ListItemSizes = Size.tiny | Size.regular | Size.big | Size.huge;

/**
 * Defines the props of the component.
 */
interface ListItemProps extends GenericProps {
    /** After content element */
    after?: ReactElement;

    /** Before content element. */
    before?: ReactElement;

    /** List item content. */
    children: string | ReactNode;

    /** Whether the list item should be highlighted. */
    isHighlighted?: boolean;

    /** Whether the list item is selected or not. */
    isSelected?: boolean;

    /** List item size. */
    size?: ListItemSizes;

    /** List item reference. */
    listItemRef?: Ref<HTMLLIElement>;

    /** Sets a custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;

    /** props that will be passed on to the Link */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

    /** Link element reference (use with {@link linkProps} prop). */
    linkRef?: Ref<HTMLAnchorElement>;

    /** Callback used to retrieved the selected entry. */
    onItemSelected?(): void;
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
function isClickable({ linkProps, onItemSelected }: ListItemProps): boolean {
    return !isEmpty(linkProps?.href) || !!onItemSelected;
}

/**
 * Component used in List element.
 *
 * @param  props The component props.
 * @return The component.
 */
const ListItem: React.FC<ListItemProps> = (props) => {
    const {
        after,
        children,
        className,
        isHighlighted,
        isSelected,
        size,
        onItemSelected,
        before,
        linkAs,
        linkProps = {},
        linkRef,
        listItemRef,
        ...forwardedProps
    } = props;
    const onKeyDown = useMemo(() => (onItemSelected ? onEnterPressed(onItemSelected) : undefined), [onItemSelected]);

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
            {isClickable(props) ? (
                /* Clickable list item */
                renderLink(
                    {
                        linkAs,
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
                        role: onItemSelected ? 'button' : undefined,
                        tabIndex: 0,
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
ListItem.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, ListItem, ListItemProps, ListItemSize, ListItemSizes, isClickable };
