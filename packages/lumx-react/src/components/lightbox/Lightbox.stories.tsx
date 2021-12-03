import React from 'react';
import {
    ImageBlock,
    Slideshow,
    SlideshowItem,
    Toolbar,
    Divider,
    Alignment,
    TextField,
    Typography,
    Link,
    Lightbox,
    ThumbnailProps,
} from '@lumx/react';
import { thumbnailsKnob } from '@lumx/react/stories/knobs/thumbnailsKnob';

export default { title: 'LumX components/lightbox/Lightbox' };

interface RowItemProps {
    image: ThumbnailProps;
}

const RowItem: React.FC<RowItemProps> = ({ image }) => {
    const [isOpen, setOpen] = React.useState(false);
    const { image: url, alt: name } = image;
    const linkRef = React.useRef(null);

    return (
        <>
            <Toolbar
                label={
                    <Link ref={linkRef} typography={Typography.subtitle1} onClick={() => setOpen(true)}>
                        {name}
                    </Link>
                }
            />
            <Lightbox
                closeButtonProps={{ label: 'Close' }}
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                parentElement={linkRef}
            >
                <Slideshow
                    activeIndex={0}
                    fillHeight
                    slideshowControlsProps={{
                        nextButtonProps: { label: 'Next' },
                        previousButtonProps: { label: 'Previous' },
                    }}
                >
                    <SlideshowItem key={name}>
                        <ImageBlock align={Alignment.center} alt={name} fillHeight image={url} />
                    </SlideshowItem>
                </Slideshow>
            </Lightbox>
        </>
    );
};

export const Focus = () => {
    const [textFieldValue, setTextFieldValue] = React.useState('');
    const images: ThumbnailProps[] = thumbnailsKnob(12);

    return (
        <>
            <TextField
                value={textFieldValue}
                onChange={setTextFieldValue}
                className="lumx-spacing-margin-vertical-big"
            />
            {images.map((image, index) => {
                const itemPosition = index + 1;
                return (
                    <div key={itemPosition}>
                        <RowItem image={image} />
                        <Divider />
                    </div>
                );
            })}
        </>
    );
};
