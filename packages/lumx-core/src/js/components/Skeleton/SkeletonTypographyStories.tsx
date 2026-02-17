import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TypographyInterface } from '../../constants';
import { ALL_COLORS } from '../../../stories/controls/color';
import { DEFAULT_PROPS } from './SkeletonTypography';

/**
 * Setup SkeletonTypography stories for a specific framework (React or Vue).
 */
export function setup({
    component: SkeletonTypography,
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
}>) {
    const meta = {
        component: SkeletonTypography,
        render: (args: any) => <SkeletonTypography {...args} />,
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
    };

    /** Text Typography */
    const TextTypography = {
        args: {
            typography: TypographyInterface.body1,
        },
    };

    /** Paragraph-like layout with varying widths */
    const WidthVariations = {
        render: () => (
            <>
                <SkeletonTypography typography={TypographyInterface.title} width="30%" />
                <SkeletonTypography typography={TypographyInterface.body1} />
                <SkeletonTypography typography={TypographyInterface.body1} width="70%" />
            </>
        ),
    };

    /** All colors */
    const AllColors = {
        argTypes: { color: { control: false } },
        args: { width: '200px' },
        decorators: [
            withCombinations({
                combinations: { rows: { key: 'color', options: ALL_COLORS } },
            }),
        ],
    };

    return { meta, TextTypography, WidthVariations, AllColors };
}
