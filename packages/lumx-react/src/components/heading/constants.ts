import { Typography } from '@lumx/core/js/constants';

/** The maximum authorized heading level. */
export const MAX_HEADING_LEVEL = 6;

/**
 * Typography to use by default depending on the heading level.
 */
export const DEFAULT_TYPOGRAPHY_BY_LEVEL = {
    h1: Typography.display1,
    h2: Typography.headline,
    h3: Typography.title,
    h4: Typography.subtitle2,
    h5: Typography.subtitle1,
    h6: Typography.body2,
};
