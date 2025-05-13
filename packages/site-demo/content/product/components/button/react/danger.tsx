import { mdiDelete } from '@lumx/icons';
import { Button, Emphasis, FlexBox, IconButton, Orientation, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <>
        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button color="red" theme={theme}>
                Delete
            </Button>
            <IconButton label="Delete" icon={mdiDelete} color="red" theme={theme} />
        </FlexBox>
        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button emphasis={Emphasis.medium} color="red" theme={theme}>
                Delete
            </Button>
            <IconButton label="Delete" icon={mdiDelete} emphasis={Emphasis.medium} color="red" theme={theme} />
        </FlexBox>
        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button emphasis={Emphasis.low} color="red" theme={theme}>
                Delete
            </Button>
            <IconButton label="Delete" icon={mdiDelete} emphasis={Emphasis.low} color="red" theme={theme} />
        </FlexBox>
    </>
);
