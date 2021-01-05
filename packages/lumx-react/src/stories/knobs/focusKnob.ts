import { number } from '@storybook/addon-knobs';

export const focusKnob = (name: string) => number(name, 0, { max: 1, min: -1, range: true, step: 0.01 });
