import React, { ReactElement, useEffect, useRef } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';

import { Theme, Themes } from 'LumX/components';

/**
 *  Authorized size values.
 */
const enum Sizes {
    tiny = 'tiny',
    regular = 'regular',
    big = 'big',
    huge = 'huge',
}
type Size = Sizes;

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
    size?: Size;
    /* before element */
    before?: ReactElement;
    /* after element */
    after?: ReactElement;
    /* Is this element active */
    isActive?: boolean;
    /* theme */
    theme?: Theme;
    /* Callback used to retrieved the selected entry*/
    // tslint:disable-next-line: typedef
    onItemSelected?;
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
    size: Sizes.regular,
    theme: Themes.light,
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
}: ListItemProps): React.ReactElement => {
    const element: React.MutableRefObject<HTMLLIElement | null> = useRef(null);

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
    // tslint:disable-next-line: typedef
    const preventParentFocus = (evt: React.FocusEvent<HTMLLIElement>): void => {
        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Currying the on entre press behavior.
     * @return Returns either undefined or a callback
     */
    // tslint:disable-next-line: typedef
    const onKeyDown = () => {
        if (isClickable && onItemSelected) {
            return onEnterPressed(onItemSelected);
        }
        return;
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

export { CLASSNAME, DEFAULT_PROPS, ListItem, ListItemProps, Sizes, Theme, Themes };
