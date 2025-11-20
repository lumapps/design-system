import { mdiHeart, mdiReply } from '@lumx/icons';
import { Button, CommentBlock, Emphasis, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <CommentBlock
        hasActions
        actions={[
            <Button key="button0" theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                24 likes
            </Button>,
            <Button key="button1" theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiReply}>
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
