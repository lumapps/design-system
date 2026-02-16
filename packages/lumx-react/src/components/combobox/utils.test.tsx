import {
    generateOptionId,
    isComboboxAction,
    isComboboxValue,
    isStringOptionComponent,
    isNodeOptionComponent,
} from './utils';
import { RegisteredComboboxAction, RegisteredComboboxOptionValue, ComboboxOptionProps } from './types';

describe('utils', () => {
    describe('generateOptionId', () => {
        it('should generate option id from combobox id and option id', () => {
            const result = generateOptionId('combobox-1', 'option-1');
            expect(result).toBe('combobox-1-option-option-1');
        });

        it('should handle numeric option ids', () => {
            const result = generateOptionId('combobox-1', 42);
            expect(result).toBe('combobox-1-option-42');
        });
    });

    describe('isComboboxAction', () => {
        it('should return true for action option', () => {
            const action: RegisteredComboboxAction = {
                id: 'action-1',
                generatedId: 'gen-1',
                isAction: true,
            };
            expect(isComboboxAction(action)).toBe(true);
        });

        it('should return false for value option', () => {
            const value: RegisteredComboboxOptionValue = {
                id: 'value-1',
                generatedId: 'gen-1',
                textValue: 'Value 1',
            };
            expect(isComboboxAction(value)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isComboboxAction(undefined)).toBe(false);
        });
    });

    describe('isComboboxValue', () => {
        it('should return true for value option', () => {
            const value: RegisteredComboboxOptionValue = {
                id: 'value-1',
                generatedId: 'gen-1',
                textValue: 'Value 1',
            };
            expect(isComboboxValue(value)).toBe(true);
        });

        it('should return false for action option', () => {
            const action: RegisteredComboboxAction = {
                id: 'action-1',
                generatedId: 'gen-1',
                isAction: true,
            };
            expect(isComboboxValue(action)).toBe(false);
        });

        it('should return true for undefined', () => {
            expect(isComboboxValue(undefined)).toBe(true);
        });
    });

    describe('isStringOptionComponent', () => {
        it('should return true for string children', () => {
            const option: ComboboxOptionProps = {
                id: 'opt-1',
                children: 'Option 1',
            };
            expect(isStringOptionComponent(option)).toBe(true);
        });

        it('should return true for number children', () => {
            const option: ComboboxOptionProps = {
                id: 'opt-1',
                children: 42,
            };
            expect(isStringOptionComponent(option)).toBe(true);
        });

        it('should return false for node children', () => {
            const option: ComboboxOptionProps = {
                id: 'opt-1',
                children: <div>Option 1</div>,
                textValue: 'Option 1',
            };
            expect(isStringOptionComponent(option)).toBe(false);
        });
    });

    describe('isNodeOptionComponent', () => {
        it('should return true for node children', () => {
            const option: ComboboxOptionProps = {
                id: 'opt-1',
                children: <div>Option 1</div>,
                textValue: 'Option 1',
            };
            expect(isNodeOptionComponent(option)).toBe(true);
        });

        it('should return false for string children', () => {
            const option: ComboboxOptionProps = {
                id: 'opt-1',
                children: 'Option 1',
            };
            expect(isNodeOptionComponent(option)).toBe(false);
        });

        it('should return false for number children', () => {
            const option: ComboboxOptionProps = {
                id: 'opt-1',
                children: 42,
            };
            expect(isNodeOptionComponent(option)).toBe(false);
        });
    });
});
