import React from 'react';

import debounce from 'lodash/debounce';

import { useVirtualFocusParent, MovingFocusContext } from '@lumx/react/utils';

import type { useComboboxRefs } from '../context/ComboboxRefsContext';
import type { useCombobox } from './useCombobox';

export interface UseComboboxTriggerArgs {
    context: ReturnType<typeof useCombobox>;
    refs: ReturnType<typeof useComboboxRefs>;
    onKeyDown?: React.KeyboardEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
}

/**
 * Provide props for the semantic and behaviors the combobox trigger.
 *
 *
 */
export function useComboboxTrigger({ context, refs, onBlur, onFocus, onKeyDown }: UseComboboxTriggerArgs) {
    const {
        comboboxId,
        listboxId,
        isOpen,
        options,
        optionsLength,
        selectedIds,
        openOnFocus,
        handleClose,
        handleOpen,
        handleSelected,
        showEmptyState = false,
        showErrorState = false,
        status,
    } = context;
    const highlightedId = useVirtualFocusParent(refs.triggerRef);
    const { dispatch: movingFocusDispatch } = React.useContext(MovingFocusContext);
    const isErrorStateDisplayed = showErrorState && isOpen && status === 'error';
    const isEmptyStateDisplayed = showEmptyState && isOpen && status === 'idle' && optionsLength === 0;

    const showPopover = (isOpen && optionsLength > 0) || isEmptyStateDisplayed || isErrorStateDisplayed;

    /**
     * A debounce close to use to leave time for the
     * listbox to process things before closing.
     * This can be useful when clicking an option to leave time for the
     * event to be processed before closing the popover.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedClose = React.useCallback(debounce(handleClose, 200), []);

    /** Cleanup any ongoing cleanup */
    React.useEffect(() => {
        return () => {
            if (debouncedClose?.cancel) {
                debouncedClose.cancel();
            }
        };
    }, [debouncedClose]);

    const handleBlur = React.useCallback(
        (event: React.FocusEvent<Element>) => {
            debouncedClose();
            if (onBlur) {
                onBlur(event);
            }
        },
        [debouncedClose, onBlur],
    );

    /** Actions triggered when the input field is focused */
    const handleFocus = (event: React.FocusEvent) => {
        // If the field is refocused in the process of closing, cancel close
        if (debouncedClose?.cancel) {
            debouncedClose.cancel();
        }
        if (onFocus) {
            onFocus(event);
        }
        /**
         * Only set the open on focus if the combobox isn't already opened.
         * This avoids the popover re-opening when an option is selected and the
         * field is refocused
         */
        if (openOnFocus && !showPopover) {
            handleOpen({ manual: true });
        }
    };

    const handleClick = () => {
        handleOpen({ manual: true });
    };

    /**
     * Keyboard shortcut management following the WAI APG pattern
     * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/#kbd_label
     */
    const handleKeyDown = React.useCallback<React.KeyboardEventHandler>(
        async (event) => {
            const { key, altKey } = event;

            /**
             * On Enter key
             * * Select option that is currently highlighted, if any
             * * Close suggestions, event if none is highlighted
             */
            if (event.key === 'Enter') {
                if (!showPopover) {
                    return;
                }
                if (highlightedId) {
                    // prevent any potential form submission
                    event.preventDefault();
                    const option = options[highlightedId];

                    handleSelected(option, 'keyboard');
                } else {
                    handleClose();
                }
                return;
            }

            /**
             * On arrow up/down
             * * If popover is already opened, do nothing
             * * If alt key pressed, show the listbox without focusing an option
             * * If arrow Up is pressed, select last option
             * * If arrow Down is pressed, select first option
             * */
            if (key === 'ArrowDown' || key === 'ArrowUp') {
                if (showPopover) {
                    return;
                }

                /** Open the listbox */
                const listBoxOptions = await handleOpen({ manual: true });
                if (!listBoxOptions) {
                    return;
                }

                /**
                 * If alt key is pressed, only open without changing visual focus
                 * as per WAI Guidelines
                 */
                if (!altKey) {
                    /** If a selected id is set, set it as current tabstop */
                    if (selectedIds?.length) {
                        movingFocusDispatch({
                            type: 'SELECT_TAB_STOP',
                            payload: {
                                id: selectedIds?.[0],
                                type: 'keyboard',
                            },
                        });
                    } else {
                        /** Focus either the first or last item depending on the keyboard arrow pressed */
                        movingFocusDispatch({
                            type: 'KEY_NAV',
                            payload: {
                                ctrlKey: false,
                                key: key === 'ArrowUp' ? 'End' : 'Home',
                            },
                        });
                    }
                }

                return;
            }

            // Forward event
            onKeyDown?.(event);
        },
        [
            onKeyDown,
            showPopover,
            highlightedId,
            options,
            handleSelected,
            handleClose,
            handleOpen,
            selectedIds,
            movingFocusDispatch,
        ],
    );

    return {
        id: comboboxId,
        role: 'combobox',
        'aria-activedescendant': showPopover && highlightedId ? highlightedId : '',
        'aria-controls': listboxId,
        'aria-owns': listboxId,
        'aria-expanded': showPopover,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
    };
}
