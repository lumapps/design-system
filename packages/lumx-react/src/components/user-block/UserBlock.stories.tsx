import React from 'react';

import { mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, Icon, Size } from '@lumx/react';
import { avatarImageKnob } from '@lumx/react/stories/knobs/image';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

import { UserBlock } from './UserBlock';

export default { title: 'LumX components/user-block/UserBlock' };

const logAction = (action: string) => () => console.log(action);
const sizes = [Size.s, Size.m, Size.l];

export const Default = ({ theme }: any) => (
    <UserBlock
        theme={theme}
        name="Emmitt O. Lum"
        fields={['Creative developer', 'Denpasar']}
        avatarProps={{ image: avatarImageKnob(), alt: 'Avatar' }}
        onMouseEnter={logAction('Mouse entered')}
        onMouseLeave={logAction('Mouse left')}
    />
);

export const Sizes = ({ theme }: any) =>
    sizes.map((size) => (
        <UserBlock
            key={size}
            theme={theme}
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatarProps={{ image: avatarImageKnob(), alt: 'Avatar' }}
            size={size}
            onMouseEnter={logAction('Mouse entered')}
            onMouseLeave={logAction('Mouse left')}
        />
    ));

export const Clickable = ({ theme }: any) => {
    const baseProps = {
        theme,
        name: 'Emmitt O. Lum',
        fields: ['Creative developer', 'Denpasar'],
        avatarProps: { image: avatarImageKnob(), alt: 'Avatar' },
    } as any;
    return (
        <>
            <p>As a button</p>
            <UserBlock {...baseProps} onClick={logAction('UserBlock clicked')} />

            <p>As a link</p>
            <UserBlock {...baseProps} linkProps={{ href: 'https://example.com' }} />

            <p>As a custom link component</p>
            <UserBlock {...baseProps} linkAs={CustomLink} />
        </>
    );
};

export const WithBadge = ({ theme }: any) => (
    <UserBlock
        theme={theme}
        name="Emmitt O. Lum"
        fields={['Creative developer', 'Denpasar']}
        avatarProps={{
            image: avatarImageKnob(),
            alt: 'Avatar',
            badge: (
                <Badge color={ColorPalette.blue}>
                    <Icon icon={mdiStar} />
                </Badge>
            ),
        }}
    />
);
