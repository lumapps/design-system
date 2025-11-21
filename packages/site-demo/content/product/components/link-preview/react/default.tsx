import { LinkPreview } from '@lumx/react';

export const App = ({ theme }: any) => (
    <LinkPreview
        title="Link title"
        description="Description"
        link="https://google.com"
        theme={theme}
        thumbnailProps={{ image: '/demo-assets/landscape1.jpg', alt: 'Landscape' }}
    />
);
