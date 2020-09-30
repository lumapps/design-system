import { mdiTagOutline } from '@lumx/icons';
import { Button, Emphasis, Size } from '@lumx/react';
import React from 'react';

declare global {
    interface Window {
        LUMX_VERSION: any;
    }
}

export const LumxVersion: React.FC = () => (
    <Button
        className="lumx-spacing-margin-left"
        emphasis={Emphasis.low}
        size={Size.s}
        leftIcon={mdiTagOutline}
        href={`https://github.com/lumapps/design-system/blob/v${window.LUMX_VERSION}/CHANGELOG.md`}
        target="_blank"
    >
        v{window.LUMX_VERSION}
    </Button>
);
