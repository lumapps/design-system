import { classNames } from '@lumx/core/js/utils';
import { Chip, ChipGroup, ImageBlock } from '@lumx/react';

export default () => (
    <div className={classNames.join('lumx-color-background-dark-L5', classNames.padding('huge'))}>
        <ImageBlock
            className="lumx-color-background-light-N"
            captionStyle={{ padding: 16 }}
            description="Lorem ipsum dolor sit amet, consectur adipiscing "
            image="https://picsum.photos/id/24/640/480"
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
