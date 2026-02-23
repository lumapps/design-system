import { avatarImageArgType, AVATAR_IMAGES } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { Size } from '../../constants';
import { type AvatarSize } from '.';

const AVATAR_SIZES = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export function setup({
    component: Avatar,
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
}>) {
    const meta = {
        component: Avatar,
        argTypes: {
            image: avatarImageArgType,
            size: getSelectArgType<AvatarSize>(AVATAR_SIZES),
        },
        args: { image: AVATAR_IMAGES.avatar1, alt: 'Avatar' },
    };

    /** Default avatar */
    const Default = {};

    /** Having onClick transforming the avatar into a button */
    const AvatarButton = {
        argTypes: {
            onClick: { action: true },
        },
    };

    /** Having href transforming the avatar into a link */
    const AvatarLink = {
        args: {
            href: 'https://example.com',
            target: '_blank',
            linkAs: 'a',
        },
    };

    /** All sizes */
    const AllSizes = {
        argTypes: {
            size: { control: false },
        },
        decorators: [
            withCombinations({
                combinations: {
                    cols: { key: 'size', options: AVATAR_SIZES },
                },
            }),
        ],
    };

    return { meta, Default, AvatarButton, AvatarLink, AllSizes };
}
