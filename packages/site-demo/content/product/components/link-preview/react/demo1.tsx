import { LinkPreview, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <LinkPreview
        title="Link title"
        description="Description"
        link="https://google.com"
        theme={theme}
        thumbnailProps={{ image: '/demo-assets/landscape1.jpg', alt: 'Landscape' }}
    />
);
