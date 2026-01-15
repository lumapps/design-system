import { LinkPreview, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <div style={{ width: 350 }}>
        <LinkPreview
            title="Link title"
            description="Description"
            link="https://google.com"
            size="big"
            theme={theme}
            thumbnailProps={{ image: '/demo-assets/landscape3.jpg', alt: 'Landscape' }}
        />
    </div>
);
