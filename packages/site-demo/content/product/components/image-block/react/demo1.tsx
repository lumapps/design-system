import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Chip, ChipGroup, FlexBox, IconButton, ImageBlock, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <ImageBlock
        actions={
            <FlexBox orientation="horizontal" gap="regular">
                <IconButton label="Edit" color="dark" emphasis="low" hasBackground icon={mdiPencil} />
                <IconButton label="See" color="dark" emphasis="low" hasBackground icon={mdiEye} />
                <IconButton label="Delete" color="dark" emphasis="low" hasBackground icon={mdiDelete} />
            </FlexBox>
        }
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="https://picsum.photos/id/256/800/546"
        tags={
            <ChipGroup>
                <Chip size="s" theme={theme}>
                    Tag 1
                </Chip>

                <Chip size="s" theme={theme}>
                    Tag 2
                </Chip>
            </ChipGroup>
        }
        theme={theme}
        title="Lorem ipsum"
        alt="Lorem ipsum"
        thumbnailProps={{ aspectRatio: 'horizontal' }}
    />
);
