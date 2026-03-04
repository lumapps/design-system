import { LinkPreview, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <LinkPreview
        title="Link title"
        description="Description"
        link="https://google.com"
        theme={theme}
        thumbnailProps={{ image: 'https://picsum.photos/id/256/800/546', alt: 'Landscape' }}
    />
);
