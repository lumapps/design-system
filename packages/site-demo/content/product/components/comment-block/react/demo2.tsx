import { mdiHeart, mdiReply } from '@lumx/icons';
import { Button, CommentBlock, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <CommentBlock
        hasActions
        isRelevant
        actions={[
            <Button key="button0" theme={theme} emphasis="low" size="s" leftIcon={mdiHeart}>
                24 likes
            </Button>,
            <Button key="button1" theme={theme} emphasis="low" size="s" leftIcon={mdiReply}>
                Reply
            </Button>,
        ]}
        theme={theme}
        avatarProps={{ image: '/demo-assets/persona.png', alt: 'Avatar' }}
        date="4 hours ago"
        name="Emmitt O. Lum"
        text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
    />
);
