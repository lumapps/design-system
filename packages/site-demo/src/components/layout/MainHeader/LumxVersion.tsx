import { mdiTagOutline } from '@lumx/icons';
import { Button } from '@lumx/react';
import { useLumxVersion } from '@lumx/demo/utils/hooks/useLumxVersion';

export const LumxVersion: React.FC = () => {
    const version = useLumxVersion();
    return (
        <Button
            emphasis="low"
            size="s"
            leftIcon={mdiTagOutline}
            href={`https://github.com/lumapps/design-system/releases/tag/v${version}`}
            target="_blank"
        >
            v{version}
        </Button>
    );
};
