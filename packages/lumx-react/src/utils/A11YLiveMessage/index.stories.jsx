import { useState } from 'react';

import { TextField, Button } from '@lumx/react';

import { A11YLiveMessage } from '.';

const LiveMessagePrefix = 'Here is your new message: ';

export default {
    component: A11YLiveMessage,
};

const Template = (args) => {
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue) {
            setMessage(`${LiveMessagePrefix}${inputValue}`);
            setInputValue('');
        }
    };

    return (
        <>
            <A11YLiveMessage {...args}>{message}</A11YLiveMessage>
            <form onSubmit={handleSubmit}>
                <TextField label="Message to read" value={inputValue} onChange={setInputValue} />
                <Button type="submit">Trigger Message</Button>
            </form>
        </>
    );
};

export const Default = Template.bind({});

export const Assertive = Template.bind({});
Assertive.args = {
    type: 'assertive',
};

export const Atomic = Template.bind({});
Atomic.args = {
    atomic: true,
    relevant: 'additions',
};

export const Hidden = Template.bind({});
Hidden.args = {
    hidden: true,
};
