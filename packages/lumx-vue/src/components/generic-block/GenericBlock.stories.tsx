import { mdiPencil } from '@lumx/icons';
import { IMAGES } from '@lumx/core/stories/controls/image';
import { setup } from '@lumx/core/js/components/GenericBlock/Stories';
import { Size } from '@lumx/core/js/constants';

import { Button, GenericBlock, Icon, Thumbnail } from '@lumx/vue';

const redBorderStyle = { border: '1px solid red' };

const { meta, ...stories } = setup({
    component: GenericBlock,
    components: { Icon, Button, Thumbnail },
});

export default {
    title: 'LumX components/generic-block/GenericBlock',
    ...meta,
};

// Demonstrates using section props (figureProps/contentProps/actionsProps) with slot content
export const SectionsInProps = {
    ...stories.SectionsInProps,
    render: (args: any) => (
        <GenericBlock
            {...args}
            class="test"
            actionsProps={{ style: redBorderStyle }}
            figureProps={{ style: redBorderStyle }}
            contentProps={{ style: redBorderStyle }}
        >
            {{
                figure: () => <Icon icon={mdiPencil} size={Size.m} />,
                default: () => 'Content',
                actions: () => <Button theme={args.theme}>Button</Button>,
            }}
        </GenericBlock>
    ),
};

// Demonstrates using named slots for each section
export const SectionsInChildren = {
    ...stories.SectionsInChildren,
    render: (args: any) => (
        <GenericBlock
            {...args}
            figureProps={{ style: redBorderStyle }}
            contentProps={{ style: redBorderStyle }}
            actionsProps={{ style: redBorderStyle }}
        >
            {{
                figure: () => <Icon icon={mdiPencil} size={Size.m} />,
                default: () => 'Content',
                actions: () => <Button theme={args.theme}>Button</Button>,
            }}
        </GenericBlock>
    ),
};

const vueTemplateRender = (args: any) => (
    <GenericBlock
        {...args}
        verticalAlign={args.vAlign}
        horizontalAlign={args.hAlign}
        figureProps={{ style: redBorderStyle }}
        contentProps={{ style: redBorderStyle }}
        actionsProps={{ style: redBorderStyle }}
    >
        {{
            figure: () => <Icon icon={mdiPencil} size={Size.m} />,
            default: () => 'Content',
            actions: () => <Button theme={args.theme}>Button</Button>,
        }}
    </GenericBlock>
);

export const Vertical = { ...stories.Vertical, render: vueTemplateRender };
export const VerticalAlignCenter = { ...stories.VerticalAlignCenter, render: vueTemplateRender };

export const VerticalOverflow = {
    args: { orientation: 'vertical', style: { width: '300px' } },
    render: (args: any) => (
        <GenericBlock
            {...args}
            figureProps={{ style: redBorderStyle }}
            contentProps={{ style: redBorderStyle }}
            actionsProps={{ style: redBorderStyle }}
        >
            {{
                figure: () => <Icon icon={mdiPencil} size={Size.m} />,
                default: () => (
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        _________________________________________________________________
                    </span>
                ),
                actions: () => <Button theme={args.theme}>Button</Button>,
            }}
        </GenericBlock>
    ),
};

export const Horizontal = { ...stories.Horizontal, render: vueTemplateRender };
export const HorizontalAlignRightBottom = { ...stories.HorizontalAlignRightBottom, render: vueTemplateRender };

export const HorizontalOverflow = {
    args: { orientation: 'horizontal', style: { width: '300px' } },
    render: (args: any) => (
        <GenericBlock
            {...args}
            figureProps={{ style: redBorderStyle }}
            contentProps={{ style: redBorderStyle }}
            actionsProps={{ style: redBorderStyle }}
        >
            {{
                figure: () => <Icon icon={mdiPencil} size={Size.m} />,
                default: () => (
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        _________________________________________________________________
                    </span>
                ),
                actions: () => <Button theme={args.theme}>Button</Button>,
            }}
        </GenericBlock>
    ),
};

export const GapSizes = {
    ...stories.GapSizes,
    render: (args: any) => (
        <>
            {[Size.regular, Size.big, Size.huge].map((gap) => (
                <GenericBlock key={gap} orientation="vertical" gap={gap} style={{ marginBottom: '40px' }}>
                    {{
                        figure: () => (
                            <div style={redBorderStyle}>
                                <Icon icon={mdiPencil} size={Size.m} />
                            </div>
                        ),
                        default: () => (
                            <div style={redBorderStyle}>
                                <h2>{gap} gap size</h2>
                                <p>block description</p>
                            </div>
                        ),
                        actions: () => (
                            <div style={redBorderStyle}>
                                <Button theme={args.theme}>Button</Button>
                            </div>
                        ),
                    }}
                </GenericBlock>
            ))}
        </>
    ),
};

export const AsAFigure = {
    ...stories.AsAFigure,
    render: () => (
        <GenericBlock as="figure" orientation="vertical" style={{ width: '150px' }}>
            {{
                figure: () => <Thumbnail alt="" image={IMAGES.portrait1s200} aspectRatio="horizontal" />,
                default: () => <figcaption>Rocky mountain landscape</figcaption>,
            }}
        </GenericBlock>
    ),
};

export const AsAnArticle = {
    ...stories.AsAnArticle,
    render: () => (
        <GenericBlock as="article" orientation="horizontal">
            {{
                figure: () => <Thumbnail alt="" size="xl" image={IMAGES.portrait1s200} aspectRatio="horizontal" />,
                default: () => (
                    <>
                        <h2>Article title</h2>
                        <p>Article description...</p>
                    </>
                ),
            }}
        </GenericBlock>
    ),
};
