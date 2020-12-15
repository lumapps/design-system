import { mdiDotsHorizontal, mdiHeart, mdiReply } from '@lumx/icons';
import { Button, CommentBlock, Emphasis, Size } from '@lumx/react';
import { IconButton } from '@lumx/react/components/button/IconButton';
import React from 'react';

export default { title: 'LumX components/comment-block/CommentBlock' };

export const WithHeaderActions = ({ theme }: any) => (
    <CommentBlock
        hasActions
        hasChildren
        actions={[
            <Button key="button0" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                24 likes
            </Button>,
            <Button key="button1" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiReply}>
                Reply
            </Button>,
        ]}
        theme={theme}
        avatar="https://i.pravatar.cc/40"
        date="4 hours ago"
        name="Emmitt O. Lum"
        text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
        headerActions={<IconButton label="Actions" icon={mdiDotsHorizontal} emphasis={Emphasis.low} size={Size.s} />}
    />
);
