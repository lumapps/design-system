import { reducer, initialState } from './reducer';
import { ComboboxAction, ComboboxState, RegisteredComboboxAction, RegisteredComboboxOptionValue } from '../types';

describe('combobox reducer', () => {
    describe('initialState', () => {
        it('should have correct initial state structure', () => {
            expect(initialState).toMatchObject({
                status: 'idle',
                isOpen: false,
                inputValue: '',
                showAll: true,
                options: {},
                type: 'listbox',
                optionsLength: 0,
            });
            expect(initialState.comboboxId).toContain('combobox-');
            expect(initialState.listboxId).toContain('combobox-');
            expect(initialState.listboxId).toContain('-popover');
        });
    });

    describe('OPEN_COMBOBOX', () => {
        it('should open combobox without manual flag', () => {
            const action: ComboboxAction = {
                type: 'OPEN_COMBOBOX',
            };
            const newState = reducer(initialState, action);
            expect(newState.isOpen).toBe(true);
            expect(newState.showAll).toBe(false);
        });

        it('should open combobox with manual flag', () => {
            const action: ComboboxAction = {
                type: 'OPEN_COMBOBOX',
                payload: { manual: true },
            };
            const newState = reducer(initialState, action);
            expect(newState.isOpen).toBe(true);
            expect(newState.showAll).toBe(true);
        });

        it('should open combobox with manual false', () => {
            const action: ComboboxAction = {
                type: 'OPEN_COMBOBOX',
                payload: { manual: false },
            };
            const newState = reducer(initialState, action);
            expect(newState.isOpen).toBe(true);
            expect(newState.showAll).toBe(false);
        });
    });

    describe('CLOSE_COMBOBOX', () => {
        it('should close combobox', () => {
            const openState: ComboboxState = {
                ...initialState,
                isOpen: true,
                showAll: false,
            };
            const action: ComboboxAction = {
                type: 'CLOSE_COMBOBOX',
            };
            const newState = reducer(openState, action);
            expect(newState.isOpen).toBe(false);
            expect(newState.showAll).toBe(true);
        });
    });

    describe('SET_INPUT_VALUE', () => {
        it('should update input value and open combobox', () => {
            const action: ComboboxAction = {
                type: 'SET_INPUT_VALUE',
                payload: 'test value',
            };
            const newState = reducer(initialState, action);
            expect(newState.inputValue).toBe('test value');
            expect(newState.isOpen).toBe(true);
            expect(newState.showAll).toBe(false);
        });

        it('should update input value from existing value', () => {
            const stateWithValue: ComboboxState = {
                ...initialState,
                inputValue: 'old value',
                showAll: true,
            };
            const action: ComboboxAction = {
                type: 'SET_INPUT_VALUE',
                payload: 'new value',
            };
            const newState = reducer(stateWithValue, action);
            expect(newState.inputValue).toBe('new value');
            expect(newState.showAll).toBe(false);
        });
    });

    describe('ADD_OPTION', () => {
        it('should add a value option', () => {
            const option: RegisteredComboboxOptionValue = {
                id: 'option-1',
                generatedId: 'gen-1',
                textValue: 'Option 1',
            };
            const action: ComboboxAction = {
                type: 'ADD_OPTION',
                payload: { id: 'option-1', option },
            };
            const newState = reducer(initialState, action);
            expect(newState.options['option-1']).toEqual(option);
            expect(newState.optionsLength).toBe(1);
            expect(newState.type).toBe('listbox');
        });

        it('should add an action option', () => {
            const option: RegisteredComboboxAction = {
                id: 'action-1',
                generatedId: 'gen-1',
                isAction: true,
            };
            const action: ComboboxAction = {
                type: 'ADD_OPTION',
                payload: { id: 'action-1', option },
            };
            const newState = reducer(initialState, action);
            expect(newState.options['action-1']).toEqual(option);
            expect(newState.optionsLength).toBe(0);
            expect(newState.type).toBe('grid');
        });

        it('should not add duplicate option', () => {
            const option: RegisteredComboboxOptionValue = {
                id: 'option-1',
                generatedId: 'gen-1',
                textValue: 'Option 1',
            };
            const stateWithOption: ComboboxState = {
                ...initialState,
                options: { 'option-1': option },
                optionsLength: 1,
            };
            const action: ComboboxAction = {
                type: 'ADD_OPTION',
                payload: { id: 'option-1', option },
            };
            const newState = reducer(stateWithOption, action);
            expect(newState).toBe(stateWithOption);
        });

        it('should maintain grid type when adding value option after action', () => {
            const actionOption: RegisteredComboboxAction = {
                id: 'action-1',
                generatedId: 'gen-1',
                isAction: true,
            };
            const stateWithAction: ComboboxState = {
                ...initialState,
                options: { 'action-1': actionOption },
                type: 'grid',
            };
            const valueOption: RegisteredComboboxOptionValue = {
                id: 'value-1',
                generatedId: 'gen-2',
                textValue: 'Value 1',
            };
            const action: ComboboxAction = {
                type: 'ADD_OPTION',
                payload: { id: 'value-1', option: valueOption },
            };
            const newState = reducer(stateWithAction, action);
            expect(newState.type).toBe('grid');
            expect(newState.optionsLength).toBe(1);
        });
    });

    describe('REMOVE_OPTION', () => {
        it('should remove a value option', () => {
            const option: RegisteredComboboxOptionValue = {
                id: 'option-1',
                generatedId: 'gen-1',
                textValue: 'Option 1',
            };
            const stateWithOption: ComboboxState = {
                ...initialState,
                options: { 'option-1': option },
                optionsLength: 1,
            };
            const action: ComboboxAction = {
                type: 'REMOVE_OPTION',
                payload: { id: 'option-1' },
            };
            const newState = reducer(stateWithOption, action);
            expect(newState.options['option-1']).toBeUndefined();
            expect(newState.optionsLength).toBe(0);
        });

        it('should remove an action option', () => {
            const option: RegisteredComboboxAction = {
                id: 'action-1',
                generatedId: 'gen-1',
                isAction: true,
            };
            const stateWithOption: ComboboxState = {
                ...initialState,
                options: { 'action-1': option },
                type: 'grid',
            };
            const action: ComboboxAction = {
                type: 'REMOVE_OPTION',
                payload: { id: 'action-1' },
            };
            const newState = reducer(stateWithOption, action);
            expect(newState.options['action-1']).toBeUndefined();
            expect(newState.optionsLength).toBe(0);
        });

        it('should not change state when removing non-existent option', () => {
            const action: ComboboxAction = {
                type: 'REMOVE_OPTION',
                payload: { id: 'non-existent' },
            };
            const newState = reducer(initialState, action);
            expect(newState).toBe(initialState);
        });

        it('should update optionsLength correctly when removing value option', () => {
            const option1: RegisteredComboboxOptionValue = {
                id: 'option-1',
                generatedId: 'gen-1',
                textValue: 'Option 1',
            };
            const option2: RegisteredComboboxOptionValue = {
                id: 'option-2',
                generatedId: 'gen-2',
                textValue: 'Option 2',
            };
            const stateWithOptions: ComboboxState = {
                ...initialState,
                options: { 'option-1': option1, 'option-2': option2 },
                optionsLength: 2,
            };
            const action: ComboboxAction = {
                type: 'REMOVE_OPTION',
                payload: { id: 'option-1' },
            };
            const newState = reducer(stateWithOptions, action);
            expect(newState.optionsLength).toBe(1);
        });
    });

    describe('unknown action', () => {
        it('should return state unchanged for unknown action', () => {
            const action = { type: 'UNKNOWN_ACTION' } as any;
            const newState = reducer(initialState, action);
            expect(newState).toBe(initialState);
        });
    });
});
