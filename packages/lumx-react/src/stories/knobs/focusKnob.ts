import { number } from '@storybook/addon-knobs';

export const focusKnob = (name: string, value = 0) => number(name, value, { max: 1, min: -1, range: true, step: 0.01 });
