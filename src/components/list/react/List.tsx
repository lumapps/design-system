import React, { Children, ReactElement, RefObject, cloneElement, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { DOWN_KEY_CODE, ENTER_KEY_CODE, TAB_KEY_CODE, UP_KEY_CODE } from 'LumX/core/constants';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { ListItem, ListItemProps, Theme } from 'LumX';
import { IGenericProps, getRootClassName, isComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { useKeyboardListNavigation, useKeyboardListNavigationType } from 'LumX/core/react/hooks';

/////////////////////////////
/**
 * Defines the props of the component.
 */
interface IListProps extends IGenericProps {
    /** List content (should use `<ListItem>`, `<ListSubheader>` or `<ListDivider>`) */
    children: ReactElement | ReactElement[];

    /** Whether the list items are clickable */
    isClickable?: boolean;

    /** Theme */
    theme?: Theme;

    /** Callback used to retrieved the select entry */
    onListItemSelected?(entry: ReactElement): void;
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
    theme: Theme.light,
};
/////////////////////////////

interface IList {
    useKeyboardListNavigation: useKeyboardListNavigationType;
}

/**
 * List component - Use vertical layout to display elements
 *
 * @return The component.
 */
const List: React.FC<ListProps> & IList = ({
    className = '',
    isClickable = DEFAULT_PROPS.isClickable,
    onListItemSelected,
    theme = DEFAULT_PROPS.theme,
    ...props
}: ListProps): ReactElement => {
    const children = Children.toArray(props.children);
    const [activeItemIndex, setActiveItemIndex] = useState(-1);
    const preventResetOnBlurOrFocus = useRef(false);
    const listElementRef = useRef() as RefObject<HTMLUListElement>;

    /**
     * Override the mouse down event - forward the event if needed
     * @param  evt       Mouse event
     * @param  idx       Index of the target in the list
     * @param  itemProps Base props
     */
    const mouseDownHandler = (evt: React.MouseEvent, idx: number, itemProps: ListItemProps): void => {
        setActiveItemIndex(idx);
        if (itemProps.onMouseDown) {
            itemProps.onMouseDown(evt);
        }
    };

    /**
     * Handle the blur event on the list -> we should reset the selection.
     */
    const onListBlurred = (): void => {
        resetActiveIndex(true);
    };

    /**
     * Handle the focus event on the list -> we should reset the selection
     */
    const onListFocused = (): void => {
        resetActiveIndex(false);
    };

    /**
     * Reset the active element
     * @param fromBlur Is request from blur event
     */
    const resetActiveIndex = (fromBlur: boolean): void => {
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
    const onKeyInteraction = (evt: React.KeyboardEvent<HTMLUListElement>): void => {
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
        const lookupTable: ReactElement[] = children
            .slice(activeItemIndex + 1)
            .concat(children.slice(0, activeItemIndex + 1));

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

    // Let's place the focus on the list so we can navigate with the keyboard.
    useEffect(() => {
        if (isClickable && listElementRef && listElementRef.current) {
            listElementRef.current.focus();
        }
    }, [isClickable]);

    return (
        <ul
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, clickable: isClickable }))}
            tabIndex={isClickable ? 0 : -1}
            onKeyDown={onKeyInteraction}
            onKeyPress={onKeyInteraction}
            onBlur={onListBlurred}
            onFocus={onListFocused}
            ref={listElementRef}
            {...props}
        >
            {children.map((elm: ReactElement, idx: number) => {
                if (isClickable && isComponent(ListItem)(elm)) {
                    const elemProps: Partial<ListItemProps> = {};
                    elemProps.onMouseDown = (evt: React.MouseEvent): void => mouseDownHandler(evt, idx, elm.props);
                    elemProps.isActive = idx === activeItemIndex;
                    elemProps.isClickable = isClickable;

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
