import React from 'react';

import { mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, Icon, Orientation, Size } from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

import { AVATAR_IMAGES } from '@lumx/react/stories/controls/image';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { UserBlock } from './UserBlock';

const sizes = [Size.s, Size.m, Size.l];

export default {
    title: 'LumX components/user-block/UserBlock',
    component: UserBlock,
    args: UserBlock.defaultProps,
    argTypes: {
        size: getSelectArgType(sizes),
        orientation: getSelectArgType(Orientation),
    },
};

/** Only an avatar */
export const AvatarOnly = {
    args: { avatarProps: { image: AVATAR_IMAGES.avatar1 } },
};

/** Avatar and name */
export const AvatarAndName = {
    args: { ...AvatarOnly.args, name: 'Emmitt O. Lum' },
};

/** Avatar, name and secondary fields */
export const AvatarAndNameAndSecondaryFields = {
    args: { ...AvatarAndName.args, fields: ['Creative developer', 'Denpasar'] },
};

/** Size variants */
export const SizesAndOrientations = {
    ...AvatarAndNameAndSecondaryFields,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'size', options: sizes },
                cols: { key: 'orientation', options: Object.values(Orientation) },
            },
        }),
    ],
};

/** Setting `onClick` to use it as a button */
export const AsButton = {
    ...AvatarAndNameAndSecondaryFields,
    argTypes: { onClick: { action: true } },
};

/** Setting the `linkProps` prop to use it as a link */
export const AsLink = {
    args: {
        ...AvatarAndNameAndSecondaryFields.args,
        linkProps: { href: 'https://example.com' },
    },
};

/** Setting the `linkAs` prop to inject a custom link component */
export const AsCustomLink = {
    args: {
        ...AvatarAndNameAndSecondaryFields.args,
        linkAs: CustomLink,
    },
};

/** Setting the `avatarProps.badge` prop to inject a badge */
export const WithBadge = {
    args: {
        ...AvatarAndNameAndSecondaryFields.args,
        avatarProps: {
            ...AvatarAndNameAndSecondaryFields.args.avatarProps,
            badge: (
                <Badge color={ColorPalette.blue}>
                    <Icon icon={mdiStar} />
                </Badge>
            ),
        },
    },
};
