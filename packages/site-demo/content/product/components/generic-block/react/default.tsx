import React from 'react';
import { GenericBlock, Avatar, Button, Size, Orientation } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <GenericBlock theme={theme} orientation={Orientation.vertical}>
            <GenericBlock.Figure>
                <Avatar theme={theme} image="/demo-assets/persona.png" alt="" size={Size.m} />
            </GenericBlock.Figure>

            <GenericBlock.Content>
                <h2>Content title</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus libero aliquet pharetra
                    luctus. Fusce nisl turpis, posuere ac tellus at, euismod vulputate libero...
                </p>
            </GenericBlock.Content>

            <GenericBlock.Actions>
                <Button theme={theme}>Actions</Button>
            </GenericBlock.Actions>
        </GenericBlock>

        <GenericBlock theme={theme} orientation={Orientation.horizontal}>
            <GenericBlock.Figure>
                <Avatar theme={theme} image="/demo-assets/persona.png" alt="" size={Size.m} />
            </GenericBlock.Figure>

            <GenericBlock.Content>
                <h2>Content title</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus libero aliquet pharetra
                    luctus. Fusce nisl turpis, posuere ac tellus at, euismod vulputate libero...
                </p>
            </GenericBlock.Content>

            <GenericBlock.Actions>
                <Button theme={theme}>Actions</Button>
            </GenericBlock.Actions>
        </GenericBlock>
    </>
);
