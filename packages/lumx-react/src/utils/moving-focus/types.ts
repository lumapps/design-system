import { ObjectValues } from '@lumx/core/src/js/types/ObjectValues';

import { CELL_SEARCH_DIRECTION, LOOP_AROUND_TYPES } from './constants';

/**
 * Base hook options
 */
export type BaseHookOptions = [
    /**
     * The DOM element to include.
     * This must be the same DOM element for the lifetime of the containing component.
     */
    ref: React.RefObject<Element>,
    /**
     * Whether or not the DOM element is currently enabled. This value can be updated as appropriate throughout the
     * lifetime of the containing component.
     */
    disabled?: boolean | null,
    /**
     * An optional string value that must be populated if the roving tabindex is being used in a grid. In that case,
     * set it to a unique key for all tabStops part of the same row that the given DOM element is currently part of. You can update this
     * row key as appropriate throughout the lifetime of the containing component, for example if the shape of the
     * grid can change dynamically.
     */
    rowKey?: string | number | null,
    /** Whether the tab stop should be set as selected by default  */
    autofocus?: boolean,
];

export type KeyDirection = 'horizontal' | 'vertical' | 'both';

export type Navigation =
    | 'PREVIOUS'
    | 'NEXT'
    | 'VERY_FIRST'
    | 'VERY_LAST'
    | 'PREVIOUS_COLUMN'
    | 'NEXT_COLUMN'
    | 'FIRST_IN_COLUMN'
    | 'LAST_IN_COLUMN'
    | 'PREVIOUS_ROW'
    | 'NEXT_ROW'
    | 'FIRST_IN_ROW'
    | 'LAST_IN_ROW';

export type LoopTypes = ObjectValues<typeof LOOP_AROUND_TYPES>;

/**
 * The behavior to set when the end of a column or row is reached
 */
export type LoopAroundByAxis = {
    col: LoopTypes;
    row: LoopTypes;
};

/**
 * The LoopAround behavior to have.
 * Can be a boolean as a shortcut
 *
 * * true => { row: 'next-loop', col: 'next-loop' }
 * * false => { row: 'next-end', col: 'next-end' }
 */
export type LoopAround = LoopAroundByAxis | boolean;
export interface MovingFocusOptions {
    /**
     * An optional direction value that only applies when the roving tabindex is not being  used within a grid.
     * This value specifies the arrow key behaviour.
     * The default value is 'horizontal'.
     * When set to 'horizontal' then only the ArrowLeft and ArrowRight keys move to the previous and next tab stop
     * respectively.
     * When set to 'vertical' then only the ArrowUp and ArrowDown keys move to the previous and next tab stop
     * respectively.
     * When set to 'both' then both the ArrowLeft and ArrowUp keys can be used to move to the previous tab stop, and
     * both the ArrowRight and ArrowDown keys can be used to move to the next tab stop.
     * If you do not pass an explicit value then the 'horizontal' behaviour applies.
     */
    direction: KeyDirection;
    /**
     * Direction in which initial virtual focus must be set focused on the virtual focus parent.
     * Ex: With `firstFocusDirection: vertical`, pressing "left" and "right" arrows while virtual focus is
     * not enabled yet will do nothing.
     * /!\ Only used with `virtualFocus` hooks.
     */
    firstFocusDirection?: KeyDirection;
    /**
     * An optional flag that, when set to `true`, will loop the tabindex around when the user  tries to tab to the
     * first or last elements in the roving tabindex, rather than stopping.
     * The default value is `false` (no looping).
     * Note that this option does not apply if the roving tabindex is being used on a grid.
     */
    loopAround: LoopAround;
    /**
     * Id of the tab stop should accept focus if selectedId is undefined.
     */
    defaultSelectedId: string | null;
    /**
     * Autofocus first or last item after the list/grid is mounted.
     */
    autofocus?: 'first' | 'last';
    /**
     * The axis on which the "skip" shortcuts (home / end) must function.
     */
    gridJumpToShortcutDirection?: 'vertical' | 'horizontal';
    /**
     * Enable default selected item focusing
     *
     * Note: The `allowFocusing` state property is set at "false" by default until an interaction is made.
     * This is required to delay focusing of the selected tab stop DOM element
     * until the user has started interacting with the roving tabindex's controls.
     * If this delay did not occur, the selected control would be focused as soon as it was mounted, which is
     * unlikely to be the desired behaviour for the page.
     */
    allowFocusing: boolean;
    /**
     * An optional an unique key.
     * If this key is set, tab stops will be re-registered each time the key changes.
     * If this key is unset, tab stops will only be registered on mount and unregistered on unmount.
     *
     * This can be useful to set if you have cases where your tab stops might be reordered without being unmounted.
     */
    listKey?: string;
}

export type TabStopRowKey = string | number;

export type BaseTypeStop = {
    id: string;
    domElementRef: React.RefObject<Element>;
    disabled: boolean;
    rowKey: TabStopRowKey | null;
    autofocus?: boolean;
};

export type TabStop = Readonly<BaseTypeStop>;

export type GridMap = {
    tabStopsByRowKey: Record<TabStopRowKey, TabStop[]>;
    rowKeys: Array<TabStopRowKey>;
};

export type State = Readonly<
    {
        /**
         * Id of the tab stop that can currently accept focus.
         */
        selectedId: string | null;
        /** Whether the user is currently using keyboard navigation */
        isUsingKeyboard: boolean;
        /**
         * Array of tab stops
         */
        tabStops: readonly TabStop[];
        /**
         * Note: The gridMap is only created if row-related navigation occurs (e.g., move to row start or end).
         * The map gets cleared if registering, unregistering, or updating.
         */
        gridMap: GridMap | null;
        /** The loop behavior to apply to the columns and rows */
        loopAround: LoopAroundByAxis;
    } & Omit<MovingFocusOptions, 'loopAround'>
>;

export type RegisterAction = {
    type: 'REGISTER_TAB_STOP';
    payload: TabStop;
};

export type UnregisterAction = {
    type: 'UNREGISTER_TAB_STOP';
    payload: { id: TabStop['id'] };
};

export type UpdateTabStopAction = {
    type: 'UPDATE_TAB_STOP';
    payload: Pick<TabStop, 'id' | 'rowKey' | 'disabled'>;
};

export type KeyNavAction = {
    type: 'KEY_NAV';
    payload: {
        id?: TabStop['id'];
        key: string;
        ctrlKey: boolean;
    };
};

export type SetAllowFocusingAction = {
    type: 'SET_ALLOW_FOCUSING';
    payload: {
        allow: boolean;
        isKeyboardNavigation?: boolean;
    };
};

export type ResetSelectedTabStopAction = {
    type: 'RESET_SELECTED_TAB_STOP';
};

export type SelectTabStopAction = {
    type: 'SELECT_TAB_STOP';
    payload: { id: TabStop['id']; type?: 'pointer' | 'keyboard' };
};

export type OptionsUpdatedAction = {
    type: 'OPTIONS_UPDATED';
    payload: MovingFocusOptions;
};

export type Action =
    | RegisterAction
    | UnregisterAction
    | UpdateTabStopAction
    | KeyNavAction
    | SelectTabStopAction
    | OptionsUpdatedAction
    | SetAllowFocusingAction
    | ResetSelectedTabStopAction;

export type Reducer<A extends Action> = (state: State, action: A) => State;

export type DirectionCoords = { from: number; direction: ObjectValues<typeof CELL_SEARCH_DIRECTION> };
export type CoordsType = number | DirectionCoords;
export type CellSelector = (cell: TabStop) => boolean;
