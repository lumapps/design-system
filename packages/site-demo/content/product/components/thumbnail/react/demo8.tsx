import { Badge, Icon, Thumbnail, Theme } from '@lumx/react';
import { mdiApps, mdiClose } from '@lumx/icons';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Thumbnail
            image="brokenurl.jpg"
            alt="Fallback to MDI icon"
            aspectRatio="square"
            size="xl"
            variant="rounded"
            theme={theme}
            fallback={mdiApps}
        />

        <Thumbnail
            image="brokenurl.jpg"
            alt="Fallback react node"
            aspectRatio="square"
            size="xl"
            variant="rounded"
            theme={theme}
            fallback={
                <Badge color="red">
                    <Icon icon={mdiClose} />
                </Badge>
            }
        />
    </>
);
