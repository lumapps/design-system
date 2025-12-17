import { AspectRatio, Chip, ChipGroup, ImageBlock, Size } from '@lumx/react';

export const App = () => (
    <div className="lumx-color-background-dark-L5 lumx-spacing-padding-huge">
        <ImageBlock
            className="lumx-color-background-light-N"
            captionStyle={{ padding: 16 }}
            description="Lorem ipsum dolor sit amet, consectur adipiscing "
            image="/demo-assets/landscape3.jpg"
            tags={
                <ChipGroup>
                    <Chip size={Size.s}>Tag 1</Chip>
                    <Chip size={Size.s}>Tag 2</Chip>
                </ChipGroup>
            }
            title="Lorem ipsum"
            alt="Lorem ipsum"
            thumbnailProps={{ aspectRatio: AspectRatio.horizontal }}
        />
    </div>
);
