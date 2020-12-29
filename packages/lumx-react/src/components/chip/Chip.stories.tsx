import React from 'react';

import { mdiClose, mdiViewList } from '@lumx/icons';
import { Chip, Icon } from '@lumx/react';
import { ColorPalette } from '..';

export default { title: 'LumX components/chip/Chip' };

export const Simple = ({ theme }: any) => <Chip theme={theme}>The chip</Chip>;

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

export const WithColor = ({ theme }: any) => (
    <>
        <Chip theme={theme} color={ColorPalette.primary}>
            My chip
        </Chip>
        <Chip theme={theme} color={ColorPalette.secondary}>
            My chip
        </Chip>
        <Chip theme={theme} color={ColorPalette.blue}>
            My chip
        </Chip>
        <Chip theme={theme} color={ColorPalette.red}>
            My chip
        </Chip>
        <Chip theme={theme} color={ColorPalette.dark}>
            My chip
        </Chip>
    </>
);

export const Highlighted = ({ theme }: any) => (
    <Chip theme={theme} color={ColorPalette.primary} isHighlighted>
        My chip
    </Chip>
);

export const Disabled = ({ theme }: any) => (
    <Chip theme={theme} color={ColorPalette.primary} isDisabled>
        My chip
    </Chip>
);
