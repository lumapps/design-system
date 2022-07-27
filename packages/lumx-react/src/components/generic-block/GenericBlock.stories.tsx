import React from 'react';
import { mdiPencil } from '@lumx/icons';
import { GenericBlock, Button, Icon, Size, Orientation, Alignment } from '@lumx/react';
import { HasTheme } from '@lumx/react/utils';

export default { title: 'LumX components/generic-block/GenericBlock' };

const redBorderStyle = { border: '1px solid red' };

/**
 * Fill sections using props
 */
export const SectionsInProps = ({ theme }: HasTheme) => (
    <GenericBlock
        figure={<Icon icon={mdiPencil} size={Size.m} />}
        actionsProps={{ style: redBorderStyle }}
        figureProps={{ style: redBorderStyle }}
        contentProps={{ style: redBorderStyle }}
        actions={<Button theme={theme}>Button</Button>}
    >
        Content
    </GenericBlock>
);

/**
 * Fill sections using child section components.
 */
export const SectionsInChildren = ({ theme }: HasTheme) => (
    <GenericBlock>
        <GenericBlock.Figure style={redBorderStyle}>
            <Icon icon={mdiPencil} size={Size.m} />
        </GenericBlock.Figure>
        <GenericBlock.Content style={redBorderStyle}>Content</GenericBlock.Content>
        <GenericBlock.Actions style={redBorderStyle}>
            <Button theme={theme}>Button</Button>
        </GenericBlock.Actions>
    </GenericBlock>
);

export const Vertical = ({ theme }: HasTheme) => (
    <GenericBlock orientation={Orientation.vertical}>
        <GenericBlock.Figure style={redBorderStyle}>
            <Icon icon={mdiPencil} size={Size.m} />
        </GenericBlock.Figure>
        <GenericBlock.Content style={redBorderStyle}>Content</GenericBlock.Content>
        <GenericBlock.Actions style={redBorderStyle}>
            <Button theme={theme}>Button</Button>
        </GenericBlock.Actions>
    </GenericBlock>
);

export const VerticalOverflow = ({ theme }: HasTheme) => (
    <GenericBlock orientation={Orientation.vertical} style={{ width: 300 }}>
        <GenericBlock.Figure style={redBorderStyle}>
            <Icon icon={mdiPencil} size={Size.m} />
        </GenericBlock.Figure>
        <GenericBlock.Content style={redBorderStyle}>
            _________________________________________________________________
        </GenericBlock.Content>
        <GenericBlock.Actions style={redBorderStyle}>
            <Button theme={theme}>Button</Button>
        </GenericBlock.Actions>
    </GenericBlock>
);

export const Horizontal = ({ theme }: HasTheme) => (
    <GenericBlock orientation={Orientation.horizontal}>
        <GenericBlock.Figure style={redBorderStyle}>
            <Icon icon={mdiPencil} size={Size.m} />
        </GenericBlock.Figure>
        <GenericBlock.Content style={redBorderStyle}>Content</GenericBlock.Content>
        <GenericBlock.Actions style={redBorderStyle}>
            <Button theme={theme}>Button</Button>
        </GenericBlock.Actions>
    </GenericBlock>
);

export const HorizontalCenter = ({ theme }: HasTheme) => (
    <GenericBlock orientation={Orientation.horizontal} hAlign={Alignment.center}>
        <GenericBlock.Figure style={redBorderStyle}>
            <Icon icon={mdiPencil} size={Size.m} />
        </GenericBlock.Figure>
        <GenericBlock.Content style={redBorderStyle}>Content</GenericBlock.Content>
        <GenericBlock.Actions style={redBorderStyle}>
            <Button theme={theme}>Button</Button>
        </GenericBlock.Actions>
    </GenericBlock>
);

export const HorizontalOverflow = ({ theme }: HasTheme) => (
    <GenericBlock orientation={Orientation.horizontal} style={{ width: 300 }}>
        <GenericBlock.Figure style={redBorderStyle}>
            <Icon icon={mdiPencil} size={Size.m} />
        </GenericBlock.Figure>
        <GenericBlock.Content style={redBorderStyle}>
            _________________________________________________________________
        </GenericBlock.Content>
        <GenericBlock.Actions style={redBorderStyle}>
            <Button theme={theme}>Button</Button>
        </GenericBlock.Actions>
    </GenericBlock>
);

export const GapSizes = ({ theme }: HasTheme) =>
    [Size.regular, Size.big, Size.huge].map((gap) => (
        <GenericBlock key={gap} orientation={Orientation.vertical} gap={gap} style={{ marginBottom: 40 }}>
            <GenericBlock.Figure style={redBorderStyle}>
                <Icon icon={mdiPencil} size={Size.m} />
            </GenericBlock.Figure>
            <GenericBlock.Content style={redBorderStyle}>
                <h2>{gap} gap size</h2>
                <p>block description</p>
            </GenericBlock.Content>
            <GenericBlock.Actions style={redBorderStyle}>
                <Button theme={theme}>Button</Button>
            </GenericBlock.Actions>
        </GenericBlock>
    ));
