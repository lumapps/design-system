import React, { cloneElement, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { DOWN_KEY_CODE, ENTER_KEY_CODE, TAB_KEY_CODE, UP_KEY_CODE } from 'LumX/core/constants';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { ListItem } from 'LumX/components/list/react/ListItem';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Theme, Themes } from 'LumX/components';
import { ListSubheader } from 'LumX/components/list/react/ListSubheader';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IListProps extends IGenericProps {
    children: ListItem[];
    /* Whether the list items are clickable */
    isClickable?: boolean;
    /**
     * The theme.
     */
    theme?: Theme;
    /* Callback used to retrieved the select entry*/
    onListItemSelected?(entry: ListItem): void;
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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}List`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    isClickable: false,
    theme: Themes.light,
};
/////////////////////////////

/**
 * List component - Use vertical layout to display elements
 *
 * @return The component.
 */
const List: React.FC<ListProps> = ({
    children,
    className = '',
    isClickable = DEFAULT_PROPS.isClickable,
    onListItemSelected,
    theme = DEFAULT_PROPS.theme,
    ...props
}: ListProps): React.ReactElement => {
    // tslint:disable-next-line: typedef
    const [activeItemIndex, setActiveItemIndex] = useState(-1);
    // tslint:disable-next-line: typedef
    const preventResetOnBlurOrFocus = useRef(false);
    // tslint:disable-next-line: typedef no-any
    const listElementRef: any = useRef();

    /**
     * Override the mouse down event - forward the event if needed
     * @param  evt       Mouse event
     * @param      idx       Index of the target in the list
     * @param      itemProps Base props
     */
    // tslint:disable-next-line: typedef
    const mouseDownHandler = (evt, idx, itemProps) => {
        setActiveItemIndex(idx);
        if (itemProps.onMouseDown) {
            itemProps.onMouseDown(evt);
        }
    };

    /**
     * Handle the blur event on the list -> we should reset the selection
     * @param  evt Focus event
     */
    // tslint:disable-next-line: typedef no-unused
    const onListBlured = (evt: React.FocusEvent<HTMLUListElement>) => {
        resetActiveIndex(true);
    };

    /**
     * Handle the focus event on the list -> we should reset the selection
     * @param  evt Focus input event
     */
    // tslint:disable-next-line: typedef no-unused
    const onListFocused = (evt: React.FocusEvent<HTMLUListElement>) => {
        resetActiveIndex(false);
    };

    /**
     * Reset the active element
     * @param fromBlur Is request from blur event
     */
    const resetActiveIndex: (fromBlur: boolean) => void = (fromBlur: boolean): void => {
        if (!isClickable || preventResetOnBlurOrFocus.current) {
            if (fromBlur) {
                preventResetOnBlurOrFocus.current = false;
            }
            return;
        }
        preventResetOnBlurOrFocus.current = false;
        setActiveItemIndex(-1);
    };

    /**
     * Handle keyboard interactions
     * @param  evt Keybord input event
     */
    // tslint:disable-next-line: typedef
    const onKeyInteraction = (evt: React.KeyboardEvent<HTMLUListElement>) => {
        if (!isClickable) {
            return;
        }
        preventResetOnBlurOrFocus.current = true;
        if (evt.keyCode === DOWN_KEY_CODE) {
            setActiveItemIndex(selectItemOnKeyDown(false));
            evt.nativeEvent.preventDefault();
            evt.nativeEvent.stopPropagation();
        } else if (evt.keyCode === UP_KEY_CODE) {
            setActiveItemIndex(selectItemOnKeyDown(true));
            evt.nativeEvent.preventDefault();
            evt.nativeEvent.stopPropagation();
        } else if (evt.keyCode === TAB_KEY_CODE) {
            evt.nativeEvent.preventDefault();
            evt.nativeEvent.stopPropagation();
        } else if (evt.keyCode === ENTER_KEY_CODE && onListItemSelected) {
            evt.nativeEvent.preventDefault();
            evt.nativeEvent.stopPropagation();
            onListItemSelected(children[activeItemIndex]);
        }
    };

    /**
     * Returns the index of the list item to activate. By default we search for the next
     * available element.
     * @param  previous Flag which indicates if we should search for the previous list item
     * @return            Index of the element to activate.
     */
    // tslint:disable-next-line: typedef
    const selectItemOnKeyDown = (previous: boolean): number => {
        const lookupTable: Array<ListItem | ListSubheader> = children
            .slice(activeItemIndex + 1)
            .concat(children.slice(0, activeItemIndex + 1));

        if (previous) {
            lookupTable.reverse();
            const first: ListItem | ListSubheader = lookupTable.shift();
            lookupTable.push(first);
        }

        let nextIdx: number = activeItemIndex;

        for (const child of lookupTable) {
            nextIdx = previous ? nextIdx - 1 : nextIdx + 1;
            if (nextIdx > children.length - 1) {
                nextIdx = 0;
            }
            if (nextIdx < 0) {
                nextIdx = lookupTable.length - 1;
            }
            if (child.type.name === 'ListItem') {
                break;
            }
        }
        return nextIdx;
    };

    // Let's place the focus on the list so we can navigate with the keyboard.
    useEffect(() => {
        if (isClickable) {
            listElementRef.current.focus();
        }
    }, []);

    return (
        <ul
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, clickable: isClickable }))}
            tabIndex={isClickable ? 0 : -1}
            onKeyDown={onKeyInteraction}
            onKeyPress={onKeyInteraction}
            onBlur={onListBlured}
            onFocus={onListFocused}
            ref={listElementRef}
            {...props}
        >
            {children.map((elm: ListItem | ListSubheader, idx: number) => {
                // tslint:disable-next-line: no-any
                const elemProps: any = {
                    key: `listEntry-${idx}`,
                };
                if (isClickable && elm.type.name === 'ListItem') {
                    // tslint:disable-next-line: no-string-literal, typedef
                    elemProps.onMouseDown = (evt) => mouseDownHandler(evt, idx, elm.props);
                    elemProps.isActive = idx === activeItemIndex;
                    elemProps.isClickable = isClickable;
                }

                return cloneElement(elm, { ...elemProps });
            })}
        </ul>
    );
};
List.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, List, ListProps, Theme, Themes };
