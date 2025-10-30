import React from 'react';

import { Button, IconButton, TextField } from '@lumx/react';
import { DisabledStateProvider } from '@lumx/react/utils';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { disableArgTypes } from '@lumx/react/stories/utils/disableArgTypes';
import { mdiFoodApple } from '@lumx/icons';

export default {
    title: 'LumX components/DisabledStateProvider',
    component: DisabledStateProvider,
    argTypes: {
        state: getSelectArgType(['disabled', undefined]),
        ...disableArgTypes(['children']),
    },
};

/**
 * Testing disabling children and re-enabling them
 */
export const Disabled = {
    args: {
        state: 'disabled',
    },
    render({ state }: any) {
        const content = (
            <>
                <Button isDisabled>Button</Button>
                <IconButton label="Icon button" icon={mdiFoodApple} />
                <TextField onChange={() => {}} value="" />
            </>
        );
        return (
            <DisabledStateProvider state={state}>
                {content}
                <br />
                <DisabledStateProvider state={null}>{content}</DisabledStateProvider>
            </DisabledStateProvider>
        );
    },
};
