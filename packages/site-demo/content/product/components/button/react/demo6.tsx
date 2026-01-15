import { Button, FlexBox, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 16 }}>
        <FlexBox fillSpace gap="big" orientation="horizontal">
            <Button fullWidth emphasis="high" theme={theme}>
                Single full width button
            </Button>
        </FlexBox>

        <FlexBox fillSpace gap="big" orientation="horizontal">
            <Button fullWidth emphasis="medium" theme={theme}>
                Two full width buttons
            </Button>
            <Button fullWidth emphasis="medium" theme={theme}>
                Two full width buttons
            </Button>
        </FlexBox>

        <FlexBox fillSpace gap="big" orientation="horizontal">
            <Button fullWidth emphasis="medium" theme={theme}>
                Single full width button
            </Button>
            <Button emphasis="medium" theme={theme}>
                Button
            </Button>
        </FlexBox>
    </div>
);
