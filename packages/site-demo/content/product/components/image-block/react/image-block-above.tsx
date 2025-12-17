import { AspectRatio, Chip, ChipGroup, ImageBlock, ImageBlockCaptionPosition, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <ImageBlock
        captionPosition={ImageBlockCaptionPosition.over}
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="/demo-assets/landscape2.jpg"
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
