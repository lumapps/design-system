/* eslint-disable jsx-a11y/anchor-is-valid */
import { mdiMenuDown, mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, Icon, IconButton, Link, Orientation, Size, Text } from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

import { AVATAR_IMAGES } from '@lumx/core/stories/controls/image';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { UserBlock } from './UserBlock';

const sizes = [Size.xs, Size.s, Size.m, Size.l];

export default {
    title: 'LumX components/user-block/UserBlock',
    component: UserBlock,
    args: UserBlock.defaultProps,
    argTypes: {
        size: getSelectArgType(sizes),
        orientation: getSelectArgType(Orientation),
    },
    decorators: [withResizableBox({ width: 'auto', height: 'auto' })],
};

/** Only an avatar */
export const AvatarOnly = {
    args: { avatarProps: { image: AVATAR_IMAGES.avatar1 } },
};

/** Avatar and name */
export const AvatarAndName = {
    args: { ...AvatarOnly.args, name: 'Emmitt O. Lum' },
};

/** Avatar and children */
export const AvatarAndCustomName = {
    args: {
        ...AvatarOnly.args,
        name: (
            <Text as="span" color="green">
                Emmitt O. Lum
            </Text>
        ),
    },
};

/** Avatar, name and secondary fields */
export const AvatarAndNameAndSecondaryFields = {
    args: {
        ...AvatarAndName.args,
        fields: ['Creative developer', 'Denpasar'],
    },
};

/** With Right component */
export const WithAfter = {
    args: {
        ...AvatarAndNameAndSecondaryFields.args,
        after: <IconButton label="View" icon={mdiMenuDown} emphasis="low" />,
    },
};

/** With after component */
export const WithAdditionalFields = {
    args: {
        ...AvatarAndName.args,
        fields: [
            <Text key={0} as="span" color="dark">
                Published a post in <Link href="#">Space</Link>
            </Text>,
            <time key={1}>May 13, 2025</time>,
        ],
        additionalFields: (
            <Text as="span" typography="body1">
                Works at the Toronto office
            </Text>
        ),
    },
    parameters: {
        // Testing constrained space
        wrapperProps: { style: { width: 245 } },
    },
};

/** Size variants */
export const SizesAndOrientations = {
    args: AvatarAndNameAndSecondaryFields.args,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'size', options: sizes },
                cols: { key: 'orientation', options: Object.values(Orientation) },
            },
        }),
    ],
};

/** Demo text ellipsis on name and fields */
export const WithConstrainedSize = {
    args: AvatarAndNameAndSecondaryFields.args,
    parameters: {
        // Testing constrained space
        wrapperProps: { style: { width: 150 } },
    },
};

/** Setting `onClick` to use it as a button */
export const AsButton = {
    args: AvatarAndNameAndSecondaryFields.args,
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
