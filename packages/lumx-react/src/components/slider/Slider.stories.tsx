import { Slider } from '@lumx/react';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';

export default {
    title: 'LumX components/slider/Slider',
    component: Slider,
    args: {
        ...Slider.defaultProps,
        min: 0,
        max: 30,
        value: 15,
        name: 'slider-html-name',
    },
    argTypes: {
        onChange: { action: true },
    },
    decorators: [withValueOnChange({})],
};

/**
 * Default slider with required props
 */
export const Default = {};

/**
 * With label and helper
 */
export const WithLabelAndHelper = {
    args: { label: 'Slider label', helper: loremIpsum('tiny') },
};

/**
 * With steps when (max-min)/steps is exactly representable in floating point
 */
export const SliderWithExactDivisibleSteps = {
    args: {
        min: 0,
        max: 5,
        value: 1,
        steps: 1,
    },
};

/**
 * With 5 steps and
 */
export const WithSteps = {
    args: { steps: 5 },
};

/**
 * With precision (three digits after the decimal point)
 */
export const WithPrecision = {
    args: { steps: 0, precision: 3 },
};
