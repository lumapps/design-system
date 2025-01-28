import { Typography } from '@lumx/react';

/**
 * Returns the classname associated to the given typography.
 * For example, for `Typography.title` it returns `lumx-typography-title`
 */
export const getTypographyClassName = (typography: Typography) => {
    return `lumx-typography-${typography}`;
};
