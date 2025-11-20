import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Alignment, Avatar, Emphasis, FlexBox, IconButton, Orientation, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <Avatar
        theme={theme}
        image="/demo-assets/persona.png"
        alt="Avatar with actions"
        size={Size.xl}
        actions={
            <FlexBox orientation={Orientation.horizontal} vAlign={Alignment.center} gap={Size.regular}>
                <IconButton
                    label="Edit"
                    color="dark"
                    emphasis={Emphasis.low}
                    hasBackground
                    icon={mdiPencil}
                    size={Size.s}
                />
                <IconButton
                    label="See"
                    color="dark"
                    emphasis={Emphasis.low}
                    hasBackground
                    icon={mdiEye}
                    size={Size.s}
                />
                <IconButton
                    label="Delete"
                    color="dark"
                    emphasis={Emphasis.low}
                    hasBackground
                    icon={mdiDelete}
                    size={Size.s}
                />
            </FlexBox>
        }
    />
);
