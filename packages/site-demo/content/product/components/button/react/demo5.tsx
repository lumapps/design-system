import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, FlexBox, IconButton, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <FlexBox gap="big" orientation="horizontal" wrap>
            <Button size="s" theme={theme}>
                Default
            </Button>

            <Button isDisabled size="s" theme={theme}>
                Disabled
            </Button>

            <Button leftIcon={mdiPencil} size="s" theme={theme}>
                With Icon
            </Button>

            <Button rightIcon={mdiMenuDown} size="s" theme={theme}>
                Dropdown
            </Button>

            <ButtonGroup>
                <Button size="s" theme={theme}>
                    Split
                </Button>
                <IconButton label="More" size="s" icon={mdiMenuDown} theme={theme} />
            </ButtonGroup>

            <IconButton label="Add" icon={mdiPlus} size="s" theme={theme} />
        </FlexBox>

        <FlexBox gap="big" orientation="horizontal" wrap>
            <Button emphasis="medium" size="s" theme={theme}>
                Default
            </Button>

            <Button isDisabled emphasis="medium" size="s" theme={theme}>
                Disabled
            </Button>
            <Button emphasis="medium" leftIcon={mdiPencil} size="s" theme={theme}>
                With Icon
            </Button>

            <Button emphasis="medium" rightIcon={mdiMenuDown} size="s" theme={theme}>
                Dropdown
            </Button>

            <ButtonGroup>
                <Button emphasis="medium" size="s" theme={theme}>
                    Split
                </Button>
                <IconButton label="More" emphasis="medium" icon={mdiMenuDown} size="s" theme={theme} />
            </ButtonGroup>

            <IconButton label="Add" icon={mdiPlus} emphasis="medium" size="s" theme={theme} />
        </FlexBox>

        <FlexBox gap="big" orientation="horizontal" wrap>
            <Button emphasis="low" size="s" theme={theme}>
                Default
            </Button>

            <Button isDisabled emphasis="low" size="s" theme={theme}>
                Disabled
            </Button>

            <Button emphasis="low" leftIcon={mdiPencil} size="s" theme={theme}>
                With Icon
            </Button>

            <Button emphasis="low" rightIcon={mdiMenuDown} size="s" theme={theme}>
                Dropdown
            </Button>

            <IconButton label="Add" icon={mdiPlus} emphasis="low" size="s" theme={theme} />
        </FlexBox>
    </>
);
