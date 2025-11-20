import { Button, ButtonGroup, Emphasis, IconButton, Size } from '@lumx/react';
import { mdiAbjadArabic, mdiFoodApple, mdiMenuDown } from '@lumx/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

export default {
    title: 'LumX components/button/ButtonGroup',
    component: ButtonGroup,
    argTypes: { children: { control: false } },
};

/** Size & emphasis variants */
export const Variants = {
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

export const OneButton = {
    args: { children: <Button>Button</Button> },
};

export const ManyButtons = {
    args: {
        children: (
            <>
                <span className="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 1</Button>
                <span className="visually-hidden">Ignore me</span>
                <IconButton emphasis="medium" label="IconButton" icon={mdiFoodApple} />
                <span className="visually-hidden">Ignore me</span>
                <IconButton emphasis="medium" isSelected label="IconButton" icon={mdiAbjadArabic} />
                <span className="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 2</Button>
                <span className="visually-hidden">Ignore me</span>
            </>
        ),
    },
};
