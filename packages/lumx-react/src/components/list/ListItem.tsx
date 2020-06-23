import React, { ReactElement, ReactNode, useEffect, useRef } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Size, Theme } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

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

    /** Whether the list item is active. */
    isActive?: boolean;

    /** Whether the list item should be highlighted. */
    isHighlighted?: boolean;

    /** Whether the list item is selected or not. */
    isSelected?: boolean;

    /** List item size. */
    size?: ListItemSizes;

    /** Theme. */
    theme?: Theme;

    /** props that will be passed on to the Link */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

    /** Callback used to retrieved the selected entry. */
    onItemSelected?(): void;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ListItemProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListItem`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    isActive: false,
    isHighlighted: false,
    isSelected: false,
    size: Size.regular,
    theme: Theme.light,
};

/**
 * Component used in List element.
 *
 * @return The component.
 */
const ListItem: React.FC<ListItemProps> = ({
    after,
    children,
    className,
    isHighlighted,
    isSelected = DEFAULT_PROPS.isSelected,
    isActive = DEFAULT_PROPS.isActive,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    onItemSelected,
    before,
    linkProps = {},
    ...forwardedProps
}) => {
    const element = useRef<HTMLLIElement | null>(null);
    const useAsLink = linkProps && !isEmpty(linkProps?.href);

    useEffect(() => {
        if (element && element.current && isActive) {
            element.current.focus();
        }
    }, [isActive]);

    /**
     * Prevent the focus event to be trigger on the parent.
     *
     * @param evt Focus event
     */
    const preventParentFocus = (evt: React.FocusEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Currying the on enter press behavior.
     *
     * @return Returns either undefined or a callback
     */
    const onKeyDown = () => {
        if (onItemSelected) {
            return onEnterPressed(onItemSelected);
        }
        return;
    };

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
            ref={element}
            className={classNames(
                className,
                handleBasicClasses({
                    highlighted: isHighlighted,
                    prefix: CLASSNAME,
                    selected: isSelected,
                    size,
                    theme,
                }),
            )}
            onFocusCapture={preventParentFocus}
            onClick={onItemSelected}
            onKeyDown={onKeyDown()}
        >
            {useAsLink ? <a {...linkProps}>{content}</a> : <div>{content}</div>}
        </li>
    );
};
ListItem.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, ListItem, ListItemProps, ListItemSize, ListItemSizes };
