import {
    ComboboxOptionProps,
    NodeOption,
    RegisteredComboboxAction,
    RegisteredComboboxOption,
    RegisteredComboboxOptionValue,
    StringOption,
} from './types';

/** Generate the combobox option id from the combobox id and the given id */
export const generateOptionId = (comboboxId: string, optionId: string | number) => `${comboboxId}-option-${optionId}`;

/** Verifies that the combobox registered option is an action */
export const isComboboxAction = (option?: RegisteredComboboxOption): option is RegisteredComboboxAction =>
    Boolean(option?.isAction);

/** Verifies that the combobox registered option is the option's value */
export const isComboboxValue = (option?: RegisteredComboboxOption): option is RegisteredComboboxOptionValue => {
    return !isComboboxAction(option);
};

/** Whether the given option has a string as child */
export const isStringOptionComponent = (option: ComboboxOptionProps): option is StringOption => {
    const { children } = option;

    return Boolean(typeof children === 'string' || typeof children === 'number');
};

/** Whether the given option has an unknown react element as child */
export const isNodeOptionComponent = (option: ComboboxOptionProps): option is NodeOption => {
    return !isStringOptionComponent(option);
};
