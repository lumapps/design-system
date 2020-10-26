import React from 'react';

import { mdiCheckCircle, mdiCloseCircle } from '@lumx/icons';
import { Chip, Icon, Size, Tooltip } from '@lumx/react';

const STABILITY = {
    stable: {
        label: 'Stable',
        color: 'green',
        icon: mdiCheckCircle,
        description: 'No breaking changes planned in the major Lumx v1.0.0 release',
    },
    unstable: {
        label: 'Unstable',
        color: 'red',
        icon: mdiCloseCircle,
        description: 'Breaking changes may occur in the major Lumx v1.0.0 release',
    },
};

type Status = keyof typeof STABILITY;

/**
 * Flag marking a component as stable in React.
 *
 * @return the component.
 */
export const ReactStabilityFlag: React.FC<{ status: Status }> = ({ status }) => {
    const { label, color, icon, description } = STABILITY[status];

    return (
        <Tooltip label={description}>
            <Chip
                className="react-stability-flag"
                size={Size.s}
                color={color}
                before={<Icon icon={icon} size={Size.xxs} />}
            >
                {label}
            </Chip>
        </Tooltip>
    );
};
