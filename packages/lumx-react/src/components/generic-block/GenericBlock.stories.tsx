import React from 'react';
import { mdiPencil } from '@lumx/icons';
import { GenericBlock, Button, Icon, Size, Orientation, Alignment } from '@lumx/react';

export default { title: 'LumX components/generic-block/GenericBlock' };

export const Horizontal = ({ theme }: any) => (
    <GenericBlock
        orientation={Orientation.horizontal}
        figure={<Icon icon={mdiPencil} size={Size.m} />}
        actionsProps={{
            style: { border: '1px solid red' },
        }}
        figureProps={{
            style: { border: '1px solid red' },
        }}
        contentProps={{
            style: { border: '1px solid red' },
        }}
        actions={<Button theme={theme}>Button</Button>}
    >
        Content
    </GenericBlock>
);

export const HorizontalWithAlignment = ({ theme }: any) => (
    <GenericBlock
        orientation={Orientation.horizontal}
        figure={<Icon icon={mdiPencil} size={Size.m} />}
        actionsProps={{
            fillSpace: true,
            style: { border: '1px solid red' },
            vAlign: 'center',
        }}
        figureProps={{
            style: { border: '1px solid red' },
        }}
        contentProps={{
            style: { border: '1px solid red' },
        }}
        actions={<Button theme={theme}>Centered button</Button>}
    >
        Content
    </GenericBlock>
);

export const HorizontalTop = ({ theme }: any) => (
    <GenericBlock
        orientation={Orientation.horizontal}
        hAlign={Alignment.top}
        figure={<Icon icon={mdiPencil} size={Size.m} />}
        actionsProps={{
            style: { border: '1px solid red' },
        }}
        figureProps={{
            style: { border: '1px solid red' },
        }}
        contentProps={{
            style: { border: '1px solid red' },
        }}
        actions={<Button theme={theme}>Centered button</Button>}
    >
        Content
    </GenericBlock>
);

export const Vertical = ({ theme }: any) => (
    <GenericBlock
        orientation={Orientation.vertical}
        figure={<Icon icon={mdiPencil} size={Size.m} />}
        actionsProps={{
            fillSpace: true,
            style: { border: '1px solid red' },
        }}
        figureProps={{
            style: { border: '1px solid red' },
        }}
        contentProps={{
            style: { border: '1px solid red' },
        }}
        actions={<Button theme={theme}>Button</Button>}
    >
        Content
    </GenericBlock>
);

export const GapSizes = ({ theme }: any) => (
    <>
        <GenericBlock
            orientation={Orientation.vertical}
            figure={<Icon icon={mdiPencil} size={Size.m} />}
            gap={Size.regular}
            style={{ marginBottom: 40 }}
            actionsProps={{
                style: { border: '1px solid red' },
            }}
            figureProps={{
                style: { border: '1px solid red' },
            }}
            contentProps={{
                style: { border: '1px solid red' },
            }}
            actions={<Button theme={theme}>Button</Button>}
        >
            <h2>Small gap size</h2>
            <p>For small blocks</p>
        </GenericBlock>

        <GenericBlock
            orientation={Orientation.vertical}
            figure={<Icon icon={mdiPencil} size={Size.m} />}
            gap={Size.big}
            style={{ marginBottom: 40 }}
            actionsProps={{
                style: { border: '1px solid red' },
            }}
            figureProps={{
                style: { border: '1px solid red' },
            }}
            contentProps={{
                style: { border: '1px solid red' },
            }}
            actions={<Button theme={theme}>Button</Button>}
        >
            <h2>Medium gap size</h2>
            <p>For medium blocks</p>
        </GenericBlock>

        <GenericBlock
            orientation={Orientation.vertical}
            figure={<Icon icon={mdiPencil} size={Size.m} />}
            gap={Size.huge}
            style={{ marginBottom: 40 }}
            actionsProps={{
                style: { border: '1px solid red' },
            }}
            figureProps={{
                style: { border: '1px solid red' },
            }}
            contentProps={{
                style: { border: '1px solid red' },
            }}
            actions={<Button theme={theme}>Button</Button>}
        >
            <h2>Big gap size</h2>
            <p>For large blocks</p>
        </GenericBlock>
    </>
);
