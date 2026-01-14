import { Typography } from '../../constants';

export const Default = {
    args: {
        children: 'Label text',
    },
    argTypes: {
        isRequired: { control: 'boolean' },
    },
};

/**
 * Required input label
 */
export const IsRequired = {
    args: { isRequired: true },
};

/**
 * Default input label
 */
export const WithCustomTypography = {
    args: { typography: Typography.subtitle1 },
};
