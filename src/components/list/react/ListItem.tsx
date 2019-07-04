import React, { ReactElement, useEffect, useRef } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Theme } from 'LumX';
import { Callback, IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';

/**
 *  Authorized size values.
 */
enum ListItemSize {
    tiny = 'tiny',
    regular = 'regular',
    big = 'big',
    huge = 'huge',
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IListItemProps extends IGenericProps {
    /* Whether the list item is selected or not */
    isSelected?: boolean;
    /* Whether the list item can be clicked */
    isClickable?: boolean;
    /* Component size*/
    size?: ListItemSize;
    /* before element */
    before?: ReactElement;
    /* after element */
    after?: ReactElement;
    /* Is this element active */
    isActive?: boolean;
    /* theme */
    theme?: Theme;
    /* Callback used to retrieved the selected entry*/
    onItemSelected?(): void;
}
type ListItemProps = IListItemProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ListItemProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    isActive: false,
    isClickable: false,
    isSelected: false,
    size: ListItemSize.regular,
    theme: Theme.light,
};
/////////////////////////////

/**
 * Component used in List element.
 *
 * @return The component.
 */
const ListItem: React.FC<ListItemProps> = ({
    after,
    children,
    className = '',
    isSelected = DEFAULT_PROPS.isSelected,
    isClickable = DEFAULT_PROPS.isSelected,
    isActive = DEFAULT_PROPS.isActive,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    onItemSelected,
    before,
    ...props
}: ListItemProps): ReactElement => {
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
    const preventParentFocus = (evt: React.FocusEvent): void => {
        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Currying the on entre press behavior.
     * @return Returns either undefined or a callback
     */
    const onKeyDown = (): Callback | undefined => {
        if (isClickable && onItemSelected) {
            return onEnterPressed(onItemSelected);
        }
        return undefined;
    };

    return (
        <li
            ref={element}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, theme, selected: isSelected, clickable: isClickable, size }),
            )}
            tabIndex={isClickable ? 0 : -1}
            onFocusCapture={preventParentFocus}
            onClick={onItemSelected}
            onKeyDown={onKeyDown()}
            {...props}
        >
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            <div className={classNames(`${CLASSNAME}__content`)}>{children}</div>
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </li>
    );
};
ListItem.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ListItem, ListItemProps, ListItemSize };
