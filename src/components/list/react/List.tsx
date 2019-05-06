import React, { cloneElement, useState } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { ListItem } from 'LumX/components/list-item/react/ListItem';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Theme, Themes } from 'LumX/components';
import { ListSubheader } from 'LumX/components/list-subheader/react/ListSubheader';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IListProps extends IGenericProps {
    /* Whether the list items are clickable */
    isClickable?: boolean;
    /**
     * The theme.
     */
    theme?: Theme;
}
type ListProps = IListProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ListProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}List`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {};
/////////////////////////////

/**
 * List component - Use vertical layout to display elements
 *
 * @return {React.ReactElement} The component.
 */
const List: React.FC<ListProps> = ({
    children,
    className = '',
    isClickable,
    ...props
}: ListProps): React.ReactElement => {
    // tslint:disable-next-line: typedef
    const [activeItemIndex, setActiveItemIndex] = useState(isClickable ? 0 : -1);

    /**
     * Override the mouse down event - forward the event if needed
     * @param {MouseEvent}  evt       Mouse event
     * @param {number}      idx       Index of the target in the list
     * @param {object}      itemProps Base props
     */
    // tslint:disable-next-line: typedef
    const mouseDownHandler = (evt, idx, itemProps) => {
        setActiveItemIndex(idx);
        if (itemProps.onMouseDown) {
            itemProps.onMouseDown(evt);
        }
    };

    return (
        <ul
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, clickable: isClickable }))}
            tabIndex={isClickable ? 0 : -1}
            {...props}
        >
            {children.map((elm: ListItem | ListSubheader, idx: number) => {
                // tslint:disable-next-line: no-any
                const elemProps: any = { isSelected: idx === activeItemIndex, isClickable };
                if (isClickable) {
                    // tslint:disable-next-line: no-string-literal, typedef
                    elemProps.onMouseDown = (evt) => mouseDownHandler(evt, idx, elm.props);
                }

                return cloneElement(elm, { ...elemProps });
            })}
        </ul>
    );
};
List.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, List, ListProps, Theme, Themes };
