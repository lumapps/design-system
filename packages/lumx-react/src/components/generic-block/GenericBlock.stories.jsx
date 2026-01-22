import { mdiPencil } from '@lumx/icons';
import { GenericBlock, Button, Icon, Size, Thumbnail } from '@lumx/react';
import { IMAGES } from '@lumx/core/stories/controls/image';

export default { title: 'LumX components/generic-block/GenericBlock' };

const redBorderStyle = { border: '1px solid red' };

export const SectionsInProps = ({ theme }) => (
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

export const SectionsInChildren = ({ theme }) => (
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

const Template = ({ theme, ...props }) => (
    <GenericBlock {...props}>
        <GenericBlock.Figure style={redBorderStyle} {...props.figureProps}>
            <Icon icon={mdiPencil} size={Size.m} />
        </GenericBlock.Figure>
        <GenericBlock.Content style={redBorderStyle} {...props.contentProps}>
            {props.content || 'Content'}
        </GenericBlock.Content>
        <GenericBlock.Actions style={redBorderStyle} {...props.actionsProps}>
            <Button theme={theme}>Button</Button>
        </GenericBlock.Actions>
    </GenericBlock>
);

export const Vertical = Template.bind({});
Vertical.args = {
    orientation: 'vertical',
};

export const VerticalAlignCenter = Template.bind({});
VerticalAlignCenter.args = {
    orientation: 'vertical',
    vAlign: 'center',
};

export const VerticalOverflow = Template.bind({});
VerticalOverflow.args = {
    orientation: 'vertical',
    style: { width: 300 },
    content: (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            _________________________________________________________________
        </span>
    ),
};

export const Horizontal = Template.bind({});
Horizontal.args = {
    orientation: 'horizontal',
};

export const HorizontalAlignRightBottom = Template.bind({});
HorizontalAlignRightBottom.args = {
    orientation: 'horizontal',
    vAlign: 'right',
    hAlign: 'bottom',
};

export const HorizontalOverflow = Template.bind({});
HorizontalOverflow.args = {
    orientation: 'horizontal',
    style: { width: 300 },
    content: (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            _________________________________________________________________
        </span>
    ),
};

export const GapSizes = ({ theme }) =>
    [Size.regular, Size.big, Size.huge].map((gap) => (
        <GenericBlock key={gap} orientation="vertical" gap={gap} style={{ marginBottom: 40 }}>
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

export const AsAFigure = () => (
    <GenericBlock as="figure" orientation="vertical" style={{ width: '150px' }}>
        <GenericBlock.Figure>
            <Thumbnail alt="" image={IMAGES.portrait1s200} aspectRatio="horizontal" />
        </GenericBlock.Figure>
        <GenericBlock.Content as="figcaption">Rocky mountain landscape</GenericBlock.Content>
    </GenericBlock>
);

export const AsAnArticle = () => (
    <GenericBlock as="article" orientation="horizontal">
        <GenericBlock.Figure>
            <Thumbnail alt="" size="xl" image={IMAGES.portrait1s200} aspectRatio="horizontal" />
        </GenericBlock.Figure>
        <GenericBlock.Content>
            <h2>Article title</h2>
            <p>Article description...</p>
        </GenericBlock.Content>
    </GenericBlock>
);
