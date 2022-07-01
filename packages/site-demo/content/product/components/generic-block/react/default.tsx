import React from 'react';
import { GenericBlock, Avatar, Button, Size, Orientation } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <GenericBlock
            theme={theme}
            figure={<Avatar theme={theme} image="/demo-assets/persona.png" alt="" size={Size.m} />}
            actions={<Button theme={theme}>Actions</Button>}
        >
            <h2>Content title</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus libero aliquet pharetra luctus.
                Fusce nisl turpis, posuere ac tellus at, euismod vulputate libero...
            </p>
        </GenericBlock>

        <GenericBlock
            theme={theme}
            orientation={Orientation.horizontal}
            figure={<Avatar theme={theme} image="/demo-assets/persona.png" alt="" size={Size.m} />}
            actions={<Button theme={theme}>Actions</Button>}
        >
            <h2>Content title</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus libero aliquet pharetra luctus.
                Fusce nisl turpis, posuere ac tellus at, euismod vulputate libero...
            </p>
        </GenericBlock>
    </>
);
