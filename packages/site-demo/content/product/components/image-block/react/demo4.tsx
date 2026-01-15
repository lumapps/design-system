import { Chip, ChipGroup, ImageBlock, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <ImageBlock
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="/demo-assets/portrait1.jpg"
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
