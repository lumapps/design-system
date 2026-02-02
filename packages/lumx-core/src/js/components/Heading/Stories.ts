import { headingElementArgType } from '@lumx/core/stories/controls/element';
import { Default as TextDefault } from '../Text/Stories';

export const Default = {
    argTypes: {
        ...TextDefault.argTypes,
        as: headingElementArgType,
        children: { control: 'text' },
    },
};

/**
 * Default heading with text
 */
export const Base = {
    args: { children: 'Some heading text' },
};

/**
 * All supported heading elements
 */
export const AllLevels = {
    ...Base,
    ...Default,
    argTypes: { as: { control: false } },
};

/**
 * All typography
 */
export const AllTypography = {
    ...Base,
    ...Default,
    argTypes: { typography: { control: false } },
};
