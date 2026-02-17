import { useMemo, useReducer, useRef } from 'react';

import { useId } from '../../../../hooks/useId';

import { ComboboxContextProps } from '../../context/ComboboxContext';
import { ComboboxProvider } from '../../context/ComboboxProvider';
import { ComboboxRefsProvider } from '../../context/ComboboxRefsContext';
import { initialState, reducer } from '../../ducks/reducer';
import { ComboboxProps, ComboboxState } from '../../types';
import { generateOptionId } from '../../utils';

/**
 *
 * A Combobox is a combination of two components:
 * * An input to enter the user's value
 * * A popover with a list of suggestions to fill the value.
 *
 * These two components are included via the Combobox.Input and Combobox.ListBox components.
 *
 * In its simplest implementation the component will automatically filter the given options
 * from the value of the input and fill the input with the textValue of the selected option.
 *
 * Props are available for more complex implementations.
 *
 * @family Combobox
 * @param ComboboxProps
 * @returns Combobox
 */
export const Combobox = <O,>({
    id: htmlId,
    inputValue,
    defaultInputValue,
    autoFilter = true,
    openOnClick,
    openOnFocus,
    status,
    showEmptyState = !autoFilter,
    showErrorState = !!status,
    selectedIds,
    onInputChange,
    onSelect,
    onOpen,
    children,
    selectionType,
    translations,
}: ComboboxProps<O>) => {
    const textFieldRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLInputElement>(null);

    // Generate a unique id for the combobox that will be used for every child components.
    const generatedId = useId();
    const comboboxId = htmlId || generatedId;
    const listboxId = `${comboboxId}-popover`;

    /** Generate the selected option id from the given selected id.  */
    const currentSelectedIds = selectedIds?.map((selectedId) => generateOptionId(comboboxId, selectedId.toString()));

    /** Generate the state */
    const [state, dispatch] = useReducer(
        reducer,
        initialState,
        (defaultState): ComboboxState => ({
            ...defaultState,
            comboboxId,
            listboxId,
            // a default input value can be set if needed
            inputValue: defaultInputValue || defaultState.inputValue,
        }),
    );

    /**
     * Return the current input value.
     */
    const currentInputValue = useMemo(() => {
        // If the component is controlled and a value is already set by the parent, use this value
        if (inputValue !== null && inputValue !== undefined) {
            return inputValue;
        }

        // Then use the local value
        if (state.inputValue) {
            return state.inputValue;
        }

        // In all other cases, return an empty string.
        return '';
    }, [inputValue, state.inputValue]);

    /** Return a memoized state */
    const synchedState: ComboboxState = useMemo(() => {
        return {
            ...state,
            showAll: !autoFilter || state.showAll,
            inputValue: currentInputValue,
            status: status || state.status,
            listboxId,
        };
    }, [currentInputValue, listboxId, autoFilter, state, status]);

    /** Props to set in the context */
    const comboboxProviderValue: ComboboxContextProps = useMemo(
        () => ({
            ...synchedState,
            openOnFocus,
            openOnClick,
            onInputChange,
            onOpen,
            onSelect,
            dispatch,
            selectionType,
            selectedIds: currentSelectedIds,
            showEmptyState,
            showErrorState,
            translations,
        }),
        [
            synchedState,
            openOnFocus,
            openOnClick,
            onInputChange,
            onOpen,
            onSelect,
            selectionType,
            currentSelectedIds,
            showEmptyState,
            showErrorState,
            translations,
        ],
    );

    return (
        <ComboboxRefsProvider triggerRef={triggerRef} anchorRef={textFieldRef}>
            <ComboboxProvider value={comboboxProviderValue}>{children}</ComboboxProvider>
        </ComboboxRefsProvider>
    );
};
