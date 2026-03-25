/* eslint-disable jsx-a11y/anchor-is-valid */
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { AVATAR_IMAGES } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { mdiMenuDown, mdiStar } from '@lumx/icons';
import { ColorPalette, Orientation, Size } from '../../constants';
import { DEFAULT_PROPS } from '.';

const sizes = [Size.xs, Size.s, Size.m, Size.l];

/**
 * Setup UserBlock stories for a specific framework (React or Vue).
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component: UserBlock,
    components: { Text, Icon, IconButton, Badge, Link },
    decorators: { withCombinations },
    render,
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { Text: any; Icon: any; IconButton: any; Badge: any; Link: any };
}>) {
    const DefaultRender = render || ((args: any) => <UserBlock {...args} />);

    const meta = {
        component: UserBlock,
        render: DefaultRender,
        argTypes: {
            size: getSelectArgType(sizes),
            orientation: getSelectArgType(Orientation),
        },
        args: DEFAULT_PROPS,
    };

    /** Only an avatar */
    const AvatarOnly = {
        args: { avatarProps: { image: AVATAR_IMAGES.avatar1 } },
    };

    /** Avatar and name */
    const AvatarAndName = {
        args: { ...AvatarOnly.args, name: 'Emmitt O. Lum' },
    };

    /** Avatar and custom name with Text component */
    const AvatarAndCustomName = {
        args: AvatarOnly.args,
        render: (args: any) => (
            <DefaultRender
                {...args}
                name={
                    <Text as="span" color="green">
                        Emmitt O. Lum
                    </Text>
                }
            />
        ),
    };

    /** Avatar, name and secondary fields */
    const AvatarAndNameAndSecondaryFields = {
        args: {
            ...AvatarAndName.args,
            fields: ['Creative developer', 'Denpasar'],
        },
    };

    /** With after component */
    const WithAfter = {
        args: AvatarAndNameAndSecondaryFields.args,
        render: (args: any) => (
            <DefaultRender {...args} after={<IconButton label="View" icon={mdiMenuDown} emphasis="low" />} />
        ),
    };

    /** With additional fields */
    const WithAdditionalFields = {
        args: AvatarAndName.args,
        render: (args: any) => (
            <DefaultRender
                {...args}
                fields={[
                    <Text key={0} as="span" color="dark">
                        Published a post in <Link href="#">Space</Link>
                    </Text>,
                    <time key={1}>May 13, 2025</time>,
                ]}
                additionalFields={
                    <Text as="span" typography="body1">
                        Works at the Toronto office
                    </Text>
                }
            />
        ),
        parameters: {
            wrapperProps: { style: { width: '245px' } },
        },
    };

    /** Size variants */
    const SizesAndOrientations = {
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
    const WithConstrainedSize = {
        args: AvatarAndNameAndSecondaryFields.args,
        parameters: {
            wrapperProps: { style: { width: '150px', resize: 'horizontal' } },
        },
    };

    /** Setting `onClick` to use it as a button */
    const AsButton = {
        args: AvatarAndNameAndSecondaryFields.args,
    };

    /** Setting the `linkProps` prop to use it as a link */
    const AsLink = {
        args: {
            ...AvatarAndNameAndSecondaryFields.args,
            linkProps: { href: 'https://example.com' },
        },
    };

    /** Setting the `avatarProps.badge` prop to inject a badge */
    const WithBadge = {
        args: AvatarAndNameAndSecondaryFields.args,
        render: (args: any) => (
            <DefaultRender
                {...args}
                avatarProps={{
                    ...args.avatarProps,
                    badge: (
                        <Badge color={ColorPalette.blue}>
                            <Icon icon={mdiStar} />
                        </Badge>
                    ),
                }}
            />
        ),
    };

    return {
        meta,
        AvatarOnly,
        AvatarAndName,
        AvatarAndCustomName,
        AvatarAndNameAndSecondaryFields,
        WithAfter,
        WithAdditionalFields,
        SizesAndOrientations,
        WithConstrainedSize,
        AsButton,
        AsLink,
        WithBadge,
    };
}
