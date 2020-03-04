import React, { Children, ReactElement, ReactNode, RefObject, cloneElement, useRef, useState } from 'react';

import classNames from 'classnames';

import {
    COMPONENT_PREFIX,
    CSS_PREFIX,
    DOWN_KEY_CODE,
    ENTER_KEY_CODE,
    TAB_KEY_CODE,
    UP_KEY_CODE,
} from '@lumx/react/constants';

import { ListItem, ListItemProps, ListItemSizes, Size, Theme } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

import { useKeyboardListNavigation, useKeyboardListNavigationType } from '@lumx/react/hooks/useKeyboardListNavigation';

/////////////////////////////
/**
 * Defines the props of the component.
 */
interface ListProps extends GenericProps {
    /** List content (should use `<ListItem>`, `<ListSubheader>` or `<ListDivider>`) */
    children: ReactNode;

    /** Whether the list items are clickable */
    isClickable?: boolean;

    /** Item padding size. */
    itemPadding?: ListItemSizes;

    /** The ref passed to the ul element. */
    listElementRef?: RefObject<HTMLElement>;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;

    /** Theme */
    theme?: Theme;

    /** Callback used to retrieved the select entry */
    onListItemSelected?(entry: ReactNode): void;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ListProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    isClickable: false,
    itemPadding: Size.big,
    theme: Theme.light,
};
/////////////////////////////

interface List {
    useKeyboardListNavigation: useKeyboardListNavigationType;
}

/**
 * List component - Use vertical layout to display elements
 *
 * @return The component.
 */
const List: React.FC<ListProps> & List = ({
    className = '',
    isClickable = DEFAULT_PROPS.isClickable,
    itemPadding = DEFAULT_PROPS.itemPadding,
    listElementRef = useRef(null),
    onListItemSelected,
    useCustomColors,
    theme = DEFAULT_PROPS.theme,
    ...props
}) => {
    const children = Children.toArray(props.children);
    const [activeItemIndex, setActiveItemIndex] = useState(-1);
    const preventResetOnBlurOrFocus = useRef(false);

    /**
     * Override the mouse down event - forward the event if needed
     * @param  evt       Mouse event
     * @param  idx       Index of the target in the list
     * @param  itemProps Base props
     */
    const mouseDownHandler = (evt: React.MouseEvent, idx: number, itemProps: ListItemProps) => {
        setActiveItemIndex(idx);
        if (itemProps.onMouseDown) {
            itemProps.onMouseDown(evt);
        }
    };

    /**
     * Handle the blur event on the list -> we should reset the selection.
     */
    const onListBlurred = () => {
        resetActiveIndex(true);
    };

    /**
     * Handle the focus event on the list -> we should reset the selection
     */
    const onListFocused = () => {
        resetActiveIndex(false);
    };

    /**
     * Reset the active element
     * @param fromBlur Is request from blur event
     */
    const resetActiveIndex = (fromBlur: boolean) => {
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
     * @param evt Keyboard input event
     */
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
     * @return Index of the element to activate.
     */
    const selectItemOnKeyDown = (previous: boolean): number => {
        const lookupTable = children.slice(activeItemIndex + 1).concat(children.slice(0, activeItemIndex + 1));

        if (previous) {
            lookupTable.reverse();
            const first = lookupTable.shift() as ReactElement;
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
            if (isComponent(ListItem)(child)) {
                break;
            }
        }
        return nextIdx;
    };

    return (
        <ul
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, clickable: isClickable }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
                [`${CSS_PREFIX}-list--item-padding-${itemPadding}`]: isClickable,
            })}
            tabIndex={isClickable ? 0 : -1}
            onKeyDown={onKeyInteraction}
            onKeyPress={onKeyInteraction}
            onBlur={onListBlurred}
            onFocus={onListFocused}
            ref={listElementRef as React.RefObject<HTMLUListElement>}
            {...props}
        >
            {children.map((elm: ReactNode, idx: number) => {
                if (isClickable && isComponent(ListItem)(elm)) {
                    const elemProps: Partial<ListItemProps> = {};
                    elemProps.onMouseDown = (evt: React.MouseEvent) => mouseDownHandler(evt, idx, elm.props);
                    elemProps.isActive = idx === activeItemIndex;
                    elemProps.tabIndex = 0;

                    return cloneElement(elm, { ...elemProps });
                }

                return elm;
            })}
        </ul>
    );
};

List.displayName = COMPONENT_NAME;
List.useKeyboardListNavigation = useKeyboardListNavigation;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, List, ListProps };
