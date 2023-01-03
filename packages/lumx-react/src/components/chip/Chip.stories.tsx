import React from 'react';

import { mdiClose, mdiViewList } from '@lumx/icons';
import { Chip, Icon } from '@lumx/react';

export default { title: 'LumX components/chip/Chip' };

export const Simple = ({ theme }: any) => <Chip theme={theme}>The chip</Chip>;
export const Clickable = ({ theme }: any) => (
    <Chip theme={theme} onClick={() => alert('clicked on chip')}>
        content
    </Chip>
);

export const Disabled = ({ theme }: any) => (
    <Chip theme={theme} onClick={() => alert('clicked on chip')} isDisabled>
        content
    </Chip>
);

export const WithAfterAndBefore = ({ theme }: any) => (
    <Chip
        theme={theme}
        after={<Icon icon={mdiClose} />}
        onAfterClick={() => alert('clicked on close')}
        before={<Icon icon={mdiViewList} />}
        onClick={() => alert('clicked on chip')}
        isClickable
    >
        content
    </Chip>
);
