import React, { ReactElement, ReactNode, useEffect, useRef } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Size, Theme } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

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
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<ListItemProps> = {
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
export const ListItem: React.FC<ListItemProps> = ({
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
    ...props
}) => {
    const element = useRef<HTMLLIElement | null>(null);

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
     * Oon enter press behavior.
     */
    const onKeyDown = onItemSelected ? onEnterPressed(onItemSelected) : undefined;

    return (
        <li
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
            onKeyDown={onKeyDown}
            role="menuitem"
            {...props}
        >
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            <div className={classNames(`${CLASSNAME}__content`)}>{children}</div>
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </li>
    );
};
ListItem.displayName = COMPONENT_NAME;
