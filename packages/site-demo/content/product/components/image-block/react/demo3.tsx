import { Chip, ChipGroup, ImageBlock, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <ImageBlock
        captionPosition="over"
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="/demo-assets/landscape2.jpg"
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
