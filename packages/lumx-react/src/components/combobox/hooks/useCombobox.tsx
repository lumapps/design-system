import React from 'react';

import { TextFieldProps } from '@lumx/react';
import { MovingFocusContext } from '@lumx/react/utils';

import { ComboboxContext } from '../context/ComboboxContext';
import { useComboboxRefs } from '../context/ComboboxRefsContext';
import { ComboboxOptionSelectEventSource, RegisteredComboboxOption } from '../types';
import { isComboboxValue } from '../utils';

type OnOptionsMounted = (options?: RegisteredComboboxOption[]) => void;

/** Retrieve the current combobox state and actions */
export const useCombobox = () => {
    const comboboxContext = React.useContext(ComboboxContext);
    const { dispatch: movingFocusDispatch } = React.useContext(MovingFocusContext);
    const { onSelect, onInputChange, onOpen, dispatch, inputValue, ...contextValues } = comboboxContext;
    const { triggerRef } = useComboboxRefs();

    /** Action triggered when the listBox is closed without selecting any option */
    const handleClose = React.useCallback(() => {
        dispatch({ type: 'CLOSE_COMBOBOX' });
        // Reset visual focus
        movingFocusDispatch({ type: 'RESET_SELECTED_TAB_STOP' });
    }, [dispatch, movingFocusDispatch]);

    // Handle callbacks on options mounted
    const [optionsMountedCallbacks, setOptionsMountedCallback] = React.useState<Array<OnOptionsMounted>>();
    React.useEffect(() => {
        if (comboboxContext.optionsLength > 0 && optionsMountedCallbacks?.length) {
            const optionsArray = Object.values(comboboxContext.options);
            // Execute callbacks
            for (const callback of optionsMountedCallbacks) {
                callback(optionsArray);
            }
            setOptionsMountedCallback(undefined);
        }
    }, [comboboxContext.options, comboboxContext.optionsLength, optionsMountedCallbacks]);

    /** Callback for when an option is selected */
    const handleSelected = React.useCallback(
        (option: RegisteredComboboxOption, source?: ComboboxOptionSelectEventSource) => {
            if (option?.isDisabled) {
                return;
            }

            if (isComboboxValue(option)) {
                /**
                 * We only close the list if the selection type is single.
                 * If it is multiple, we want to allow the user to continue
                 * selecting multiple options.
                 */
                if (comboboxContext.selectionType !== 'multiple') {
                    handleClose();
                }
                /** Call parent onSelect callback  */
                if (onSelect) {
                    onSelect(option);
                }
            }

            /** If the option itself has a custom action, also call it */
            if (option?.onSelect) {
                option.onSelect(option, source);
            }

            /** Reset focus on input */
            if (triggerRef?.current) {
                triggerRef.current?.focus();
            }
        },
        [comboboxContext.selectionType, handleClose, onSelect, triggerRef],
    );

    /** Callback for when the input must be updated */
    const handleInputChange: TextFieldProps['onChange'] = React.useCallback(
        (value, ...args) => {
            // Update the local state
            dispatch({ type: 'SET_INPUT_VALUE', payload: value });
            // If a callback if given, call it with the value
            if (onInputChange) {
                onInputChange(value, ...args);
            }
            // Reset visual focus
            movingFocusDispatch({ type: 'RESET_SELECTED_TAB_STOP' });
        },
        [dispatch, movingFocusDispatch, onInputChange],
    );

    /**
     * Open the popover
     *
     * @returns a promise with the updated context once all options are mounted
     */
    const handleOpen = React.useCallback(
        (params?: { manual?: boolean }) => {
            /** update the local state */
            dispatch({ type: 'OPEN_COMBOBOX', payload: params });
            /** If a parent callback was given, trigger it with state information */
            if (onOpen) {
                onOpen({ currentValue: inputValue, manual: Boolean(params?.manual) });
            }

            // Promise resolving options on mount
            return new Promise<RegisteredComboboxOption[] | undefined>((resolve) => {
                // Append to the list of callback on options mounted
                setOptionsMountedCallback((callbacks = []) => {
                    callbacks.push(resolve);
                    return callbacks;
                });
            });
        },
        [dispatch, inputValue, onOpen],
    );

    return React.useMemo(
        () => ({
            handleClose,
            handleOpen,
            handleInputChange,
            handleSelected,
            dispatch,
            inputValue,
            ...contextValues,
        }),
        [contextValues, dispatch, handleClose, handleInputChange, handleOpen, handleSelected, inputValue],
    );
};
