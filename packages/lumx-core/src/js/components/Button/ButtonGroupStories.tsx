import { mdiMenuDown } from '@lumx/icons';
import { Emphasis, Size } from '@lumx/core/js/constants';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Setup ButtonGroup stories for a specific framework (React or Vue).
 * Framework-specific components (Button, IconButton) are injected via `components`.
 */
export function setup({
    component: ButtonGroup,
    components: { Button, IconButton },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { Button: any; IconButton: any };
}>) {
    const meta = {
        component: ButtonGroup,
        render: (args: any) => <ButtonGroup {...args} />,
        argTypes: {
            children: { control: false },
        },
        args: ButtonGroup.defaultProps,
    };

    /** Size & emphasis variants */
    const Variants = {
        render: ({ size, emphasis, theme }: any) => (
            <ButtonGroup>
                <Button size={size} emphasis={emphasis} theme={theme}>
                    Button
                </Button>
                <IconButton size={size} emphasis={emphasis} theme={theme} label="IconButton" icon={mdiMenuDown} />
            </ButtonGroup>
        ),
        decorators: [
            withCombinations({
                cellStyle: { padding: '10px' },
                combinations: {
                    rows: { '': { size: Size.m }, 'size=s': { size: Size.s } },
                    cols: { key: 'emphasis', options: [undefined, Emphasis.medium, Emphasis.low] },
                },
            }),
        ],
    };

    /** ButtonGroup with a single button */
    const OneButton = {
        render: (args: any) => (
            <ButtonGroup {...args}>
                <Button>Button</Button>
            </ButtonGroup>
        ),
    };

    /** ButtonGroup with many buttons */
    const ManyButtons = {
        render: (args: any) => (
            <ButtonGroup {...args}>
                <span className="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 1</Button>
                <span className="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 2</Button>
                <span className="visually-hidden">Ignore me</span>
            </ButtonGroup>
        ),
    };

    return { meta, Variants, OneButton, ManyButtons };
}
