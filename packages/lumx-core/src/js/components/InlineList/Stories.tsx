import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { allTypographyArgType } from '@lumx/core/stories/controls/typography';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { mdiEarth } from '@lumx/icons';

/**
 * Setup InlineList stories for a specific framework (React or Vue).
 * Framework-specific components (Text, Icon) are injected via `components`.
 */
export function setup({
    component: InlineList,
    components: { Text, Icon },
    decorators: { withResizableBox },
}: SetupStoriesOptions<{
    decorators: 'withResizableBox';
    components: { Text: any; Icon: any };
}>) {
    const meta = {
        component: InlineList,
        argTypes: {
            typography: allTypographyArgType,
            color: colorArgType,
            colorVariant: colorVariantArgType,
            children: { control: false },
        },
    };

    /** Inline list with three simple text elements */
    const WithElements = {
        render: (args: any) => (
            <InlineList {...args}>
                <span>Some text</span>
                <span>Some other text</span>
                <span>Some other other text</span>
            </InlineList>
        ),
    };

    /** Using color, typography and more complex elements */
    const MixedNoWrapAndTruncate = {
        args: {
            typography: 'body1',
            color: 'dark',
            colorVariant: 'L2',
            style: { width: '100%' },
        },
        render: ({ children, ...args }: any) => (
            <InlineList {...args}>
                <Text as="span" truncate>
                    Very very very very very long text
                </Text>
                <Text as="span" noWrap>
                    <Icon icon={mdiEarth} />
                    Some text
                </Text>
                <Text as="span" truncate>
                    Very very very very very long text
                </Text>
            </InlineList>
        ),
        decorators: [withResizableBox({ width: '400px' })],
    };

    /** Line wrap on overflow */
    const Wrap = {
        args: { wrap: true },
        render: ({ children, ...args }: any) => (
            <InlineList {...args}>
                <Text as="span">Very very very very very long text</Text>
                <Text as="span">
                    <Icon icon={mdiEarth} />
                    Some text
                </Text>
                <Text as="span">Very very very very very long text</Text>
            </InlineList>
        ),
        decorators: [withResizableBox({ width: '400px' })],
    };

    return { meta, WithElements, MixedNoWrapAndTruncate, Wrap };
}
