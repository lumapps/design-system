import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TypographyInterface } from '../../constants';
import { ALL_COLORS } from '../../../stories/controls/color';
import { DEFAULT_PROPS } from './SkeletonTypography';

/**
 * Setup SkeletonTypography stories for a specific framework (React or Vue).
 */
export function setup({
    component,
    render,
}: SetupStoriesOptions<{
    decorators?: never;
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                typography: {
                    control: 'select',
                    options: Object.values(TypographyInterface),
                },
                color: {
                    control: 'select',
                    options: ALL_COLORS,
                },
                width: {
                    control: 'text',
                },
            },
            args: {
                ...DEFAULT_PROPS,
                typography: TypographyInterface.body1,
            },
        },

        /** Text Typography */
        TextTypography: {
            args: {
                typography: TypographyInterface.body1,
            },
        },
    };
}
