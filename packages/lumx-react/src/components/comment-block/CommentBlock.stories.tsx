/* eslint-disable react/jsx-key,react/display-name */
import { mdiDotsHorizontal, mdiHeart, mdiReply } from '@lumx/icons';
import { Button, CommentBlock } from '@lumx/react';
import { IconButton } from '@lumx/react/components/button/IconButton';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { avatarImageArgType, AVATAR_IMAGES } from '@lumx/react/stories/controls/image';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';

export default {
    title: 'LumX components/comment-block/CommentBlock',
    component: CommentBlock,
    decorators: [withNestedProps()],
    args: {
        'avatarProps.image': AVATAR_IMAGES.avatar1,
    },
    argTypes: {
        'avatarProps.image': avatarImageArgType,
        actions: { control: false },
        headerActions: { control: false },
        children: { control: false },
    },
};

/**
 * Minimal comment block
 */
export const Minimal = {
    args: {
        text: loremIpsum('short'),
    },
};

/**
 * Full-featured comment block
 */
export const FullFeatured = {
    args: {
        name: 'Emmitt O. Lum',
        text: loremIpsum('short'),
        date: '5 days ago',
        fullDate: 'Monday, March 30, 2021 at 4:06 PM',
        hasActions: true,
    },
    render: (props: any) => (
        <CommentBlock
            {...props}
            actions={[
                <Button emphasis="low" size="s" leftIcon={mdiHeart}>
                    24 likes
                </Button>,
                <Button emphasis="low" size="s" leftIcon={mdiReply}>
                    Reply
                </Button>,
            ]}
            headerActions={<IconButton label="Actions" icon={mdiDotsHorizontal} emphasis="low" size="s" />}
        />
    ),
};

/**
 * Marked as relevant
 */
export const Relevant = {
    ...FullFeatured,
    args: { ...FullFeatured.args, isRelevant: true },
};

/**
 * Comment thread
 */
export const Thread = {
    ...FullFeatured,
    args: {
        ...FullFeatured.args,
        isOpen: true,
        children: [
            <CommentBlock
                avatarProps={{ image: AVATAR_IMAGES.avatar2, alt: '' }}
                name="John Doe"
                date="5 days ago"
                text={loremIpsum('tiny')}
            />,
            <CommentBlock
                avatarProps={{ image: AVATAR_IMAGES.avatar4, alt: '' }}
                name="Jane Doe"
                date="5 days ago"
                text={loremIpsum('tiny')}
            />,
        ],
    },
};
