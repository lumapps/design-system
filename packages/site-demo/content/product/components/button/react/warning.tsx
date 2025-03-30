import { mdiClose } from '@lumx/icons';
import { Button, Emphasis, FlexBox, IconButton, Orientation, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <>
        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button color="yellow" theme={theme}>
                Remove
            </Button>
            <IconButton label="Remove" icon={mdiClose} color="yellow" theme={theme} />
        </FlexBox>
        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button emphasis={Emphasis.medium} color="yellow" theme={theme}>
                Remove
            </Button>
            <IconButton label="Remove" icon={mdiClose} emphasis={Emphasis.medium} color="yellow" theme={theme} />
        </FlexBox>
    </>
);
