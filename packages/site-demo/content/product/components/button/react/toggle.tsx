import { mdiBellPlus, mdiBellRing, mdiCheck } from '@lumx/icons';
import { Button, Emphasis, IconButton } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <>
        <Button theme={theme} emphasis={Emphasis.medium}>
            Subscribe
        </Button>

        <Button theme={theme} emphasis={Emphasis.medium} leftIcon={mdiCheck} isSelected>
            Subscribed
        </Button>

        <IconButton theme={theme} emphasis={Emphasis.medium} icon={mdiBellPlus} />

        <IconButton theme={theme} emphasis={Emphasis.medium} icon={mdiBellRing} isSelected />
    </>
);
