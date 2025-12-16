import { AspectRatio, Badge, Icon, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

import { mdiApps, mdiClose } from '@lumx/icons';

export const App = ({ theme }: any) => (
    <>
        <Thumbnail
            image="brokenurl.jpg"
            alt="Fallback to MDI icon"
            aspectRatio={AspectRatio.square}
            size={Size.xl}
            variant={ThumbnailVariant.rounded}
            theme={theme}
            fallback={mdiApps}
        />

        <Thumbnail
            image="brokenurl.jpg"
            alt="Fallback react node"
            aspectRatio={AspectRatio.square}
            size={Size.xl}
            variant={ThumbnailVariant.rounded}
            theme={theme}
            fallback={
                <Badge color="red">
                    <Icon icon={mdiClose} />
                </Badge>
            }
        />
    </>
);
