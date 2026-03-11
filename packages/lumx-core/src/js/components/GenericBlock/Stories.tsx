import { mdiPencil } from '@lumx/icons';
import { IMAGES } from '@lumx/core/stories/controls/image';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { Size } from '../../constants';

const redBorderStyle = { border: '1px solid red' };

export function setup({
    component: GenericBlock,
    components: { Icon, Button, Thumbnail },
}: SetupStoriesOptions<{
    components: { Icon: any; Button: any; Thumbnail: any };
}>) {
    const meta = {
        component: GenericBlock,
    };

    const SectionsInProps = {
        render: (args: any) => (
            <GenericBlock
                figure={<Icon icon={mdiPencil} size={Size.m} />}
                actionsProps={{ style: redBorderStyle }}
                figureProps={{ style: redBorderStyle }}
                contentProps={{ style: redBorderStyle }}
                actions={<Button theme={args.theme}>Button</Button>}
            >
                Content
            </GenericBlock>
        ),
    };

    const SectionsInChildren = {
        render: (args: any) => (
            <GenericBlock>
                <GenericBlock.Figure style={redBorderStyle}>
                    <Icon icon={mdiPencil} size={Size.m} />
                </GenericBlock.Figure>
                <GenericBlock.Content style={redBorderStyle}>Content</GenericBlock.Content>
                <GenericBlock.Actions style={redBorderStyle}>
                    <Button theme={args.theme}>Button</Button>
                </GenericBlock.Actions>
            </GenericBlock>
        ),
    };

    const templateRender = (args: any) => (
        <GenericBlock {...args}>
            <GenericBlock.Figure style={redBorderStyle}>
                <Icon icon={mdiPencil} size={Size.m} />
            </GenericBlock.Figure>
            <GenericBlock.Content style={redBorderStyle}>{args.content || 'Content'}</GenericBlock.Content>
            <GenericBlock.Actions style={redBorderStyle}>
                <Button theme={args.theme}>Button</Button>
            </GenericBlock.Actions>
        </GenericBlock>
    );

    const Vertical = {
        render: templateRender,
        args: { orientation: 'vertical' },
    };

    const VerticalAlignCenter = {
        render: templateRender,
        args: { orientation: 'vertical', vAlign: 'center' },
    };

    const VerticalOverflow = {
        render: templateRender,
        args: {
            orientation: 'vertical',
            style: { width: 300 },
            content: (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    _________________________________________________________________
                </span>
            ),
        },
    };

    const Horizontal = {
        render: templateRender,
        args: { orientation: 'horizontal' },
    };

    const HorizontalAlignRightBottom = {
        render: templateRender,
        args: { orientation: 'horizontal', vAlign: 'right', hAlign: 'bottom' },
    };

    const HorizontalOverflow = {
        render: templateRender,
        args: {
            orientation: 'horizontal',
            style: { width: 300 },
            content: (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    _________________________________________________________________
                </span>
            ),
        },
    };

    const GapSizes = {
        render: (args: any) =>
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
                        <Button theme={args.theme}>Button</Button>
                    </GenericBlock.Actions>
                </GenericBlock>
            )),
    };

    const AsAFigure = {
        render: () => (
            <GenericBlock as="figure" orientation="vertical" style={{ width: '150px' }}>
                <GenericBlock.Figure>
                    <Thumbnail alt="" image={IMAGES.portrait1s200} aspectRatio="horizontal" />
                </GenericBlock.Figure>
                <GenericBlock.Content as="figcaption">Rocky mountain landscape</GenericBlock.Content>
            </GenericBlock>
        ),
    };

    const AsAnArticle = {
        render: () => (
            <GenericBlock as="article" orientation="horizontal">
                <GenericBlock.Figure>
                    <Thumbnail alt="" size="xl" image={IMAGES.portrait1s200} aspectRatio="horizontal" />
                </GenericBlock.Figure>
                <GenericBlock.Content>
                    <h2>Article title</h2>
                    <p>Article description...</p>
                </GenericBlock.Content>
            </GenericBlock>
        ),
    };

    return {
        meta,
        SectionsInProps,
        SectionsInChildren,
        Vertical,
        VerticalAlignCenter,
        VerticalOverflow,
        Horizontal,
        HorizontalAlignRightBottom,
        HorizontalOverflow,
        GapSizes,
        AsAFigure,
        AsAnArticle,
    };
}
