import { Button, ButtonGroup, IconButton } from '@lumx/react';
import { mdiMenuDown } from '@lumx/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Button/ButtonGroupStories';

const { meta, ...stories } = setup({
    component: ButtonGroup,
    decorators: { withCombinations },
    overrides: {
        Variants: {
            render: ({ size, emphasis, theme }: any) => (
                <ButtonGroup>
                    <Button size={size} emphasis={emphasis} theme={theme}>
                        Button
                    </Button>
                    <IconButton size={size} emphasis={emphasis} theme={theme} label="IconButton" icon={mdiMenuDown} />
                </ButtonGroup>
            ),
        },
        OneButton: {
            args: { children: <Button>Button</Button> },
        },
        ManyButtons: {
            args: {
                children: (
                    <>
                        <span className="visually-hidden">Ignore me</span>
                        <Button emphasis="medium">Button 1</Button>
                        <span className="visually-hidden">Ignore me</span>
                        <Button emphasis="medium">Button 2</Button>
                        <span className="visually-hidden">Ignore me</span>
                    </>
                ),
            },
        },
    },
});

export default {
    title: 'LumX components/button/ButtonGroup',
    ...meta,
};

export const Variants = { ...stories.Variants };
export const OneButton = { ...stories.OneButton };
export const ManyButtons = { ...stories.ManyButtons };
