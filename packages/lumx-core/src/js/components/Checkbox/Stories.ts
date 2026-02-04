import omit from 'lodash/omit';

import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';

import { Checkbox } from './index';

export const Default = {
    component: Checkbox,
    argTypes: {
        isChecked: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
        onChange: { action: true, table: { disable: true } },
        ref: { table: { disable: true } },
        inputRef: { table: { disable: true } },
        className: { table: { disable: true } },
        name: { control: false },
        value: { control: false },
    },
    args: {
        ...omit(Checkbox.defaultProps, ['theme']),
        isChecked: false,
        name: 'checkbox-html-name',
        value: 'checkbox-html-value',
    },
};

/**
 * Default checkbox
 */
export const Base = {
    args: {},
};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    args: {
        label: 'Checkbox label',
        helper: loremIpsum('tiny'),
    },
};

/**
 * With intermediate state
 */
export const IntermediateState = {
    args: {
        isChecked: 'intermediate',
    },
};

/**
 * Disabled state variations
 */
export const Disabled = {
    args: {
        label: 'Checkbox label',
        helper: 'Checkbox is disabled because...',
    },
    argTypes: {
        ...disableArgTypes(['isDisabled']),
    },
};
