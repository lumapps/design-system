import { Chip, ChipGroup, ImageBlock } from '@lumx/react';

export default () => (
    <div className="lumx-color-background-dark-L5 lumx-spacing-padding-huge">
        <ImageBlock
            className="lumx-color-background-light-N"
            captionStyle={{ padding: 16 }}
            description="Lorem ipsum dolor sit amet, consectur adipiscing "
            image="/demo-assets/landscape3.jpg"
            tags={
                <ChipGroup>
                    <Chip size="s">Tag 1</Chip>
                    <Chip size="s">Tag 2</Chip>
                </ChipGroup>
            }
            title="Lorem ipsum"
            alt="Lorem ipsum"
            thumbnailProps={{ aspectRatio: 'horizontal' }}
        />
    </div>
);
