import { LinkPreview, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <div style={{ width: 350 }}>
        <LinkPreview
            title="Link title"
            description="Description"
            link="https://google.com"
            size="big"
            theme={theme}
            thumbnailProps={{ image: 'https://picsum.photos/id/24/640/480', alt: 'Landscape' }}
        />
    </div>
);
