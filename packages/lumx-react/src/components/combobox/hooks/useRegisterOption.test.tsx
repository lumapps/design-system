import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useRegisterOption } from './useRegisterOption';
import { ComboboxContext } from '../context/ComboboxContext';
import { RegisteredComboboxOptionValue } from '../types';
import { initialState } from '../ducks/reducer';

describe('useRegisterOption', () => {
    it('should register option on mount when shouldRegister is true', () => {
        const dispatch = vi.fn();
        const option: RegisteredComboboxOptionValue = {
            id: 'option-1',
            generatedId: 'gen-1',
            textValue: 'Option 1',
        };

        const TestComponent = () => {
            useRegisterOption('option-1', option, true);
            return null;
        };

        render(
            <ComboboxContext.Provider
                value={{
                    ...initialState,
                    dispatch,
                    openOnFocus: false,
                    openOnClick: false,
                    selectionType: 'single',
                    optionsLength: 0,
                    translations: {
                        clearLabel: '',
                        tryReloadLabel: '',
                        showSuggestionsLabel: '',
                        noResultsForInputLabel: (input) => input || '',
                        loadingLabel: '',
                        serviceUnavailableLabel: '',
                        nbOptionsLabel: (options) => `${options}`,
                    },
                }}
            >
                <TestComponent />
            </ComboboxContext.Provider>,
        );

        expect(dispatch).toHaveBeenCalledWith({
            type: 'ADD_OPTION',
            payload: { id: 'option-1', option },
        });
    });

    it('should not register option when shouldRegister is false', () => {
        const dispatch = vi.fn();
        const option: RegisteredComboboxOptionValue = {
            id: 'option-1',
            generatedId: 'gen-1',
            textValue: 'Option 1',
        };

        const TestComponent = () => {
            useRegisterOption('option-1', option, false);
            return null;
        };

        render(
            <ComboboxContext.Provider
                value={{
                    ...initialState,
                    dispatch,
                    openOnFocus: false,
                    openOnClick: false,
                    selectionType: 'single',
                    optionsLength: 0,
                    translations: {
                        clearLabel: '',
                        tryReloadLabel: '',
                        showSuggestionsLabel: '',
                        noResultsForInputLabel: (input) => input || '',
                        loadingLabel: '',
                        serviceUnavailableLabel: '',
                        nbOptionsLabel: (options) => `${options}`,
                    },
                }}
            >
                <TestComponent />
            </ComboboxContext.Provider>,
        );

        expect(dispatch).not.toHaveBeenCalled();
    });

    it('should unregister option on unmount', () => {
        const dispatch = vi.fn();
        const option: RegisteredComboboxOptionValue = {
            id: 'option-1',
            generatedId: 'gen-1',
            textValue: 'Option 1',
        };

        const TestComponent = () => {
            useRegisterOption('option-1', option, true);
            return null;
        };

        const { unmount } = render(
            <ComboboxContext.Provider
                value={{
                    ...initialState,
                    dispatch,
                    openOnFocus: false,
                    openOnClick: false,
                    selectionType: 'single',
                    optionsLength: 0,
                    translations: {
                        clearLabel: '',
                        tryReloadLabel: '',
                        showSuggestionsLabel: '',
                        noResultsForInputLabel: (input) => input || '',
                        loadingLabel: '',
                        serviceUnavailableLabel: '',
                        nbOptionsLabel: (options) => `${options}`,
                    },
                }}
            >
                <TestComponent />
            </ComboboxContext.Provider>,
        );

        dispatch.mockClear();
        act(() => {
            unmount();
        });

        expect(dispatch).toHaveBeenCalledWith({
            type: 'REMOVE_OPTION',
            payload: { id: 'option-1' },
        });
    });

    it('should re-register option when option changes', () => {
        const dispatch = vi.fn();
        const option1: RegisteredComboboxOptionValue = {
            id: 'option-1',
            generatedId: 'gen-1',
            textValue: 'Option 1',
        };
        const option2: RegisteredComboboxOptionValue = {
            id: 'option-1',
            generatedId: 'gen-1',
            textValue: 'Option 1 Updated',
        };

        const TestComponent = ({ option }: { option: RegisteredComboboxOptionValue }) => {
            useRegisterOption('option-1', option, true);
            return null;
        };

        const { rerender } = render(
            <ComboboxContext.Provider
                value={{
                    ...initialState,
                    dispatch,
                    openOnFocus: false,
                    openOnClick: false,
                    selectionType: 'single',
                    optionsLength: 0,
                    translations: {
                        clearLabel: '',
                        tryReloadLabel: '',
                        showSuggestionsLabel: '',
                        noResultsForInputLabel: (input) => input || '',
                        loadingLabel: '',
                        serviceUnavailableLabel: '',
                        nbOptionsLabel: (options) => `${options}`,
                    },
                }}
            >
                <TestComponent option={option1} />
            </ComboboxContext.Provider>,
        );

        dispatch.mockClear();

        rerender(
            <ComboboxContext.Provider
                value={{
                    ...initialState,
                    dispatch,
                    openOnFocus: false,
                    openOnClick: false,
                    selectionType: 'single',
                    optionsLength: 0,
                    translations: {
                        clearLabel: '',
                        tryReloadLabel: '',
                        showSuggestionsLabel: '',
                        noResultsForInputLabel: (input) => input || '',
                        loadingLabel: '',
                        serviceUnavailableLabel: '',
                        nbOptionsLabel: (options) => `${options}`,
                    },
                }}
            >
                <TestComponent option={option2} />
            </ComboboxContext.Provider>,
        );

        expect(dispatch).toHaveBeenCalledWith({
            type: 'REMOVE_OPTION',
            payload: { id: 'option-1' },
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: 'ADD_OPTION',
            payload: { id: 'option-1', option: option2 },
        });
    });
});
