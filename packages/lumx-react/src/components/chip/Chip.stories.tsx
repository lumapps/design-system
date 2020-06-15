/* tslint:disable:jsx-no-lambda */
import React from 'react';

import { mdiClose, mdiViewList } from '@lumx/icons';
import { Chip, Icon } from '@lumx/react';

export default { title: 'LumX components/Chip' };

export const simple = ({ theme }: any) => <Chip theme={theme}>The chip</Chip>;

export const withAfterAndBefore = ({ theme }: any) => (
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
