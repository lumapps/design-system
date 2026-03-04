import { Chip, ChipGroup, ImageBlock, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <ImageBlock
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="https://picsum.photos/id/653/275/500"
        tags={
            <ChipGroup align="center">
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
        align="center"
        thumbnailProps={{ aspectRatio: 'original' }}
    />
);
