import { Button, Emphasis, FlexBox, Orientation, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 16 }}>
        <FlexBox fillSpace gap={Size.big} orientation={Orientation.horizontal}>
            <Button fullWidth emphasis={Emphasis.high} theme={theme}>
                Single full width button
            </Button>
        </FlexBox>

        <FlexBox fillSpace gap={Size.big} orientation={Orientation.horizontal}>
            <Button fullWidth emphasis={Emphasis.medium} theme={theme}>
                Two full width buttons
            </Button>
            <Button fullWidth emphasis={Emphasis.medium} theme={theme}>
                Two full width buttons
            </Button>
        </FlexBox>

        <FlexBox fillSpace gap={Size.big} orientation={Orientation.horizontal}>
            <Button fullWidth emphasis={Emphasis.medium} theme={theme}>
                Single full width button
            </Button>
            <Button emphasis={Emphasis.medium} theme={theme}>
                Button
            </Button>
        </FlexBox>
    </div>
);
