import { KindMessage, Message } from '@lumx/react';
import { decorators } from '@lumx/react/story-block';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Message', decorators };

const options = {
    Error: KindMessage.error,
    Info: KindMessage.info,
    Success: KindMessage.success,
    Warning: KindMessage.warning,
};

export const message = () => (
    <Message
        kind={select('Kind of message', options, KindMessage.error)}
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
