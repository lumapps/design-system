import { Kind, Message } from '@lumx/react';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { enumKnob } from '@lumx/react/stories/knobs/enumKnob';
import { mdiDelete } from '@lumx/icons/';

export default { title: 'LumX components/message/Message' };

export const Default = () => (
    <Message
        kind={enumKnob('Kind of message', [undefined, ...Object.values(Kind)], undefined)}
        hasBackground={boolean('Has background', false)}
    >
        {text(
            'Message',
            `Message text quisque tincidunt lobortis dui non auctor.Donec porta,
                ligula volutpat vehicula aliquet, dui sapien tempus felis, sed.`,
        )}
    </Message>
);

export const CustomIcon = () => (
    <Message icon={mdiDelete} kind="info" hasBackground>
        Lorem ipsum quisque tincidunt lobortis dui non auctor.Donec porta, ligula volutpat vehicula aliquet, dui sapien
        tempus felis, sed.
    </Message>
);
