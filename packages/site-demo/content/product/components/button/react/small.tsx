import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';

import { Button, ButtonGroup, Emphasis, FlexBox, IconButton, Orientation, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button size={Size.s} theme={theme}>
                Default
            </Button>

            <Button isDisabled size={Size.s} theme={theme}>
                Disabled
            </Button>

            <Button leftIcon={mdiPencil} size={Size.s} theme={theme}>
                With Icon
            </Button>

            <Button rightIcon={mdiMenuDown} size={Size.s} theme={theme}>
                Dropdown
            </Button>

            <ButtonGroup>
                <Button size={Size.s} theme={theme}>
                    Split
                </Button>
                <IconButton label="More" size={Size.s} icon={mdiMenuDown} theme={theme} />
            </ButtonGroup>

            <IconButton label="Add" icon={mdiPlus} size={Size.s} theme={theme} />
        </FlexBox>

        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button emphasis={Emphasis.medium} size={Size.s} theme={theme}>
                Default
            </Button>

            <Button isDisabled emphasis={Emphasis.medium} size={Size.s} theme={theme}>
                Disabled
            </Button>
            <Button emphasis={Emphasis.medium} leftIcon={mdiPencil} size={Size.s} theme={theme}>
                With Icon
            </Button>

            <Button emphasis={Emphasis.medium} rightIcon={mdiMenuDown} size={Size.s} theme={theme}>
                Dropdown
            </Button>

            <ButtonGroup>
                <Button emphasis={Emphasis.medium} size={Size.s} theme={theme}>
                    Split
                </Button>
                <IconButton label="More" emphasis={Emphasis.medium} icon={mdiMenuDown} size={Size.s} theme={theme} />
            </ButtonGroup>

            <IconButton label="Add" icon={mdiPlus} emphasis={Emphasis.medium} size={Size.s} theme={theme} />
        </FlexBox>

        <FlexBox gap={Size.big} orientation={Orientation.horizontal} wrap>
            <Button emphasis={Emphasis.low} size={Size.s} theme={theme}>
                Default
            </Button>

            <Button isDisabled emphasis={Emphasis.low} size={Size.s} theme={theme}>
                Disabled
            </Button>

            <Button emphasis={Emphasis.low} leftIcon={mdiPencil} size={Size.s} theme={theme}>
                With Icon
            </Button>

            <Button emphasis={Emphasis.low} rightIcon={mdiMenuDown} size={Size.s} theme={theme}>
                Dropdown
            </Button>

            <IconButton label="Add" icon={mdiPlus} emphasis={Emphasis.low} size={Size.s} theme={theme} />
        </FlexBox>
    </>
);
