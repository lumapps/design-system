import { resolveRadioState } from './resolveRadioState';

describe(resolveRadioState, () => {
    it('should check the radio of the group value only', () => {
        expect(resolveRadioState({ value: 'a' }, { value: 'a' }).isChecked).toBe(true);
        expect(resolveRadioState({ value: 'b' }, { value: 'a' }).isChecked).toBe(false);
    });

    it('should let the radio props win over the group', () => {
        expect(resolveRadioState({ value: 'a', isChecked: false, name: 'own' }, { value: 'a', name: 'group' })).toEqual(
            { isChecked: false, name: 'own' },
        );
    });

    it('should take the name of the group', () => {
        expect(resolveRadioState({ value: 'a' }, { name: 'group' }).name).toBe('group');
    });

    it('should leave the checked state to the radio without a group value', () => {
        expect(resolveRadioState({ value: 'a' })).toEqual({ isChecked: undefined, name: undefined });
        expect(resolveRadioState({ value: 'a' }, { name: 'group' }).isChecked).toBeUndefined();
    });

    it('should uncheck every radio of a controlled group with no value', () => {
        expect(resolveRadioState({ value: 'a' }, { isControlled: true }).isChecked).toBe(false);
        expect(resolveRadioState({}, { isControlled: true }).isChecked).toBe(false);
    });
});
