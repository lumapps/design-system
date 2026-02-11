import React from 'react';

import { MovingFocusContext } from '@lumx/react/utils';

import { isComboboxValue } from '../utils';
import { UseComboboxTriggerArgs, useComboboxTrigger } from './useComboboxTrigger';

/** Is printable character key press */
const isTypeEvent = ({ key, altKey, ctrlKey, metaKey }: React.KeyboardEvent) =>
    key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey;

/**
 * Provide props for the semantic and behaviors the combobox button trigger
 *
 * Overrides the useComboboxTrigger() props & behavior to add a jump to option
 * on printable character key down.
 */
export function useComboboxButton(args: UseComboboxTriggerArgs) {
    const {
        context: { handleOpen },
        onKeyDown: parentOnKeyDown,
    } = args;
    const {
        dispatch: movingFocusDispatch,
        state: { selectedId: highlightedId },
    } = React.useContext(MovingFocusContext);

    const searchValueRef = React.useRef('');
    const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    const onKeyDown = React.useMemo<React.KeyboardEventHandler>(() => {
        function clearSearchTimeout() {
            const searchTimeout = searchTimeoutRef.current;
            if (!searchTimeout) {
                return;
            }
            clearTimeout(searchTimeout);
            searchTimeoutRef.current = undefined;
        }
        function clearSearch() {
            searchValueRef.current = '';
            clearSearchTimeout();
        }

        return async (event) => {
            if (!isTypeEvent(event)) {
                // Forward key down event
                parentOnKeyDown?.(event);
                return undefined;
            }
            event.stopPropagation();

            // Clear current search timeout
            clearSearchTimeout();

            // Open combobox and wait for options to mount
            const options = await handleOpen({ manual: false });
            const optionArray = options && Object.values(options);
            if (!optionArray?.length) {
                return undefined;
            }

            // Append key to current search
            searchValueRef.current += event.key.toLowerCase();
            const searchValue = searchValueRef.current;

            // Clear search after 500ms
            searchTimeoutRef.current = setTimeout(clearSearch, 500);

            // Search is containing all the same letters (ex: aaaa)
            const allTheSameLetters = searchValue.split('').every((letter) => letter === searchValue[0]);

            // start from currently selected option
            let startIndex = optionArray.findIndex((option) => option.generatedId === highlightedId);
            if (startIndex === -1) {
                startIndex = 0;
            }

            let index = startIndex;
            do {
                // Increment index and loop around to 0 if we get over the array length
                index = (index + 1) % optionArray.length;
                const option = optionArray[index];
                // Search by text value or fallback on id.
                const optionText = isComboboxValue(option) ? option?.textValue || option?.id : null;
                if (isComboboxValue(option) && optionText) {
                    const optionTextValue = optionText.toLowerCase();

                    // Search on first letter if search is all the same letters
                    const searchText = allTheSameLetters ? searchValue[0] : searchValue;

                    // Option text value starts with searched text
                    if (optionTextValue.startsWith(searchText)) {
                        movingFocusDispatch({
                            type: 'SELECT_TAB_STOP',
                            payload: {
                                id: option.generatedId,
                                type: 'keyboard',
                            },
                        });
                        break;
                    }
                }
            } while (index !== startIndex);

            return clearSearchTimeout;
        };
    }, [handleOpen, parentOnKeyDown, highlightedId, movingFocusDispatch]);

    return useComboboxTrigger({ ...args, onKeyDown });
}
