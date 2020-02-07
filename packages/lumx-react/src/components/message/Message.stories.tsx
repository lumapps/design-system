import { Message, MessageKind } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Message' };

export const message = () => (
    <Message
        kind={select('Kind of message', MessageKind, MessageKind.error)}
        hasBackground={boolean('Has background', false)}
    >
        <span>
            {text(
                'Message',
                `Message text quisque tincidunt lobortis dui non auctor.Donec porta,
                ligula volutpat vehicula aliquet, dui sapien tempus felis, sed.`,
            )}
        </span>
    </Message>
);
