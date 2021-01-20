import { ListItemProps } from '@lumx/react';
import { isClickable } from '@lumx/react/components/list/ListItem';

import { isComponent } from '@lumx/react/utils';
import { flattenChildren } from '@lumx/react/utils/flattenChildren';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import get from 'lodash/get';
import {
    cloneElement,
    Key,
    ReactElement,
    ReactNode,
    RefObject,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState,
} from 'react';

type Listener = (evt: KeyboardEvent) => void;

interface Options {
    /** List of items to navigate on. */
    items: ReactNode[] | ReactNode;
    /** Reference to the list-like element controlling the navigation. */
    ref: RefObject<HTMLElement>;

    /**
     * On list item navigated callback (triggered on ARROW key navigation).
     *
     * @param index Index of the navigated item among the sibling items.
     * @param key   React key of the navigated item.
     */
    onListItemNavigated?(index: number, key: Key | null): void;

    /**
     * On list item selected callback (via ENTER key or click).
     *
     * @param index Index of the selected item among the sibling items.
     * @param key   React key of the selected item.
     * @param evt   Source event (either mouse or keyboard event).
     */
    onListItemSelected?(index: number, key: Key | null, evt: SyntheticEvent): void;
}

interface Output {
    /** List of items transformed to accommodate keyboard navigation. */
    items: ReactNode[];
    /** Whether the list contains clickable items or not. */
    hasClickableItem: boolean;
}

export type useInteractiveList = (options: Options) => Output;

const INITIAL_INDEX = -1;

function onKeyboardFocus(props: any, handler: (evt: FocusEvent) => void) {
    let isMouseDown = false;
    return {
        onFocus(evt: FocusEvent) {
            props.onFocus?.(evt);
            if (!isMouseDown) {
                handler(evt);
            }
        },
        onMouseDown(evt: MouseEvent) {
            props.onMouseDown?.(evt);
            isMouseDown = true;
        },
        onMouseUp(evt: MouseEvent) {
            props.onMouseUp?.(evt);
            isMouseDown = false;
        },
    };
}

const isNavigableItem = (node: ReactNode): node is ReactElement => {
    return isComponent('ListItem')(node) && isClickable(node.props);
};

/**
 * This custom hook detects clickable list item in a list and make them navigable with the keyboard.
 *
 * @param  options See {@link Options}
 * @return See {@link Output}
 */
export const useInteractiveList: useInteractiveList = (options) => {
    const { ref, onListItemSelected, onListItemNavigated } = options;
    const items = useMemo(() => flattenChildren(options.items), [options.items]);
    const [activeItemIndex, setActiveItemIndex] = useState(INITIAL_INDEX);

    // Attach listeners to the list.
    useEffect(() => {
        const { current: listElement } = ref;
        if (!listElement) {
            return undefined;
        }

        /**
         * This function calculates the next index in the list to be active
         * @param  index current index
         * @param  code  key code pressed
         * @return next index
         */
        const getNextIndex = (index: number, key: string): number => {
            switch (key) {
                case 'ArrowDown':
                    return index + 1 < items.length ? index + 1 : 0;
                case 'ArrowUp':
                    return index - 1 >= 0 ? index - 1 : items.length - 1;
                default:
                    return INITIAL_INDEX;
            }
        };

        /**
         * Resets the active index to the initial state
         */
        const resetActiveIndex = () => {
            setActiveItemIndex(INITIAL_INDEX);
        };

        /**
         * Handles navigation with the arrows using the keyboard
         * @param evt Key event
         */
        const onArrowPressed: Listener = (evt) => {
            const { key } = evt;
            if (key !== 'ArrowUp' && key !== 'ArrowDown') {
                return;
            }

            let nextIndex = activeItemIndex;
            let iterations = 0;

            // Move to next navigable item.
            do {
                nextIndex = getNextIndex(nextIndex, key);
                iterations += 1;
            } while (
                nextIndex !== INITIAL_INDEX &&
                nextIndex !== activeItemIndex &&
                !isNavigableItem(items[nextIndex] as any) &&
                iterations < items.length
            );

            setActiveItemIndex(nextIndex);
            evt.preventDefault();
            evt.stopPropagation();
            onListItemNavigated?.(nextIndex, get(items, [nextIndex, 'key']));
        };

        /**
         * Reset active list item index when focusing outside the list.
         * @param evt Focus out event
         */
        const onFocusOut = (evt: FocusEvent) => {
            if (!evt.relatedTarget || !listElement.contains(evt.relatedTarget as any)) {
                resetActiveIndex();
            }
        };

        listElement.addEventListener('focusout', onFocusOut);
        listElement.addEventListener('keydown', onArrowPressed);
        return () => {
            listElement.removeEventListener('focusout', onFocusOut);
            listElement.removeEventListener('keydown', onArrowPressed);
        };
    }, [ref, activeItemIndex, items, onListItemNavigated]);

    return useMemo(() => {
        let hasClickableItem = false;
        const transformedItems = items.map((item, index) => {
            // Ignore if list not clickable or item is not a simple list item.
            if (!isNavigableItem(item)) {
                return item;
            }

            hasClickableItem = true;
            const isHighlighted = index === activeItemIndex;

            // Clone list item: inject ref, add tab index and active state.
            return cloneElement<ListItemProps>(item, {
                ...item.props,
                isHighlighted: item.props.isHighlighted ?? isHighlighted,
                linkRef: mergeRefs(item.props.linkRef, (element: any) => {
                    if (isHighlighted) {
                        element?.focus();
                    }
                }),
                onItemSelected(evt) {
                    item.props.onItemSelected?.();
                    onListItemSelected?.(index, item.key, evt);
                },
                ...onKeyboardFocus(item.props, () => {
                    setActiveItemIndex(index);
                }),
            });
        });
        return { items: transformedItems, hasClickableItem };
    }, [items, activeItemIndex, onListItemSelected]);
};
