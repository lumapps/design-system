import { DEFAULT_PROPS } from '.';

export const Default = {
    argTypes: {
        onChange: { action: true },
        name: { control: false },
        value: { control: false },
    },
    args: {
        ...DEFAULT_PROPS,
        isChecked: false,
        name: 'checkbox-html-name',
        value: 'checkbox-html-value',
    },
};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    argTypes: {
        label: { control: 'text' },
        helper: { control: 'text' },
    },
};

/**
 * With intermediate state
 */
export const IntermediateState = {
    argTypes: {
        isChecked: { control: false },
    },
    args: {
        isChecked: 'intermediate',
    },
};

/**
 * Disabled
 */
export const Disabled = {
    argTypes: {
        isDisabled: { control: false },
        'aria-disabled': { control: false },
    },
};
