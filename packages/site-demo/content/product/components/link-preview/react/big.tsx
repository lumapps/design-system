import { LinkPreview, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <div style={{ width: 350 }}>
        <LinkPreview
            title="Link title"
            description="Description"
            link="https://google.com"
            size={Size.big}
            theme={theme}
            thumbnailProps={{ image: '/demo-assets/landscape3.jpg', alt: 'Landscape' }}
        />
    </div>
);
