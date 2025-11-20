import { Alignment, AspectRatio, Chip, ChipGroup, ImageBlock, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <ImageBlock
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="/demo-assets/portrait1.jpg"
        tags={
            <ChipGroup align={Alignment.center}>
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
        align={Alignment.center}
        thumbnailProps={{ aspectRatio: AspectRatio.original }}
    />
);
