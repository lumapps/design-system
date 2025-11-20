import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import {
    AspectRatio,
    Chip,
    ChipGroup,
    Emphasis,
    FlexBox,
    IconButton,
    ImageBlock,
    Orientation,
    Size,
} from '@lumx/react';

export const App = ({ theme }: any) => (
    <ImageBlock
        actions={
            <FlexBox orientation={Orientation.horizontal} gap="regular">
                <IconButton label="Edit" color="dark" emphasis={Emphasis.low} hasBackground icon={mdiPencil} />

                <IconButton label="See" color="dark" emphasis={Emphasis.low} hasBackground icon={mdiEye} />

                <IconButton label="Delete" color="dark" emphasis={Emphasis.low} hasBackground icon={mdiDelete} />
            </FlexBox>
        }
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="/demo-assets/landscape1.jpg"
        tags={
            <ChipGroup>
                <Chip size={Size.s} theme={theme}>
                    Tag 1
                </Chip>

                <Chip size={Size.s} theme={theme}>
                    Tag 2
                </Chip>
            </ChipGroup>
        }
        theme={theme}
        title="Lorem ipsum"
        alt="Lorem ipsum"
        thumbnailProps={{ aspectRatio: AspectRatio.horizontal }}
    />
);
