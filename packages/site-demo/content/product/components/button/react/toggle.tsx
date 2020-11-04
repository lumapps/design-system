import { mdiBellPlus, mdiBellRing, mdiCheck } from '@lumx/icons';
import { Button, Emphasis, FlexBox, IconButton, Orientation, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <>
        <FlexBox gap={Size.big} orientation={Orientation.horizontal}>
            <Button emphasis={Emphasis.medium} theme={theme}>
                Subscribe
            </Button>

            <Button leftIcon={mdiCheck} emphasis={Emphasis.medium} isSelected={true} theme={theme}>
                Subscribed
            </Button>
        </FlexBox>

        <FlexBox gap={Size.big} orientation={Orientation.horizontal}>
            <IconButton emphasis={Emphasis.medium} icon={mdiBellPlus} theme={theme} />

            <IconButton emphasis={Emphasis.medium} icon={mdiBellRing} isSelected={true} theme={theme} />
        </FlexBox>
    </>
);
