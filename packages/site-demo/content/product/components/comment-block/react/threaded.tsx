import { mdiHeart, mdiReply } from '@lumx/icons';
import { Button, CommentBlock, Emphasis, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <CommentBlock
            hasActions
            isOpen
            actions={[
                <Button key="button0" theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                    24 likes
                </Button>,
                <Button key="button1" theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiReply}>
                    2 replies
                </Button>,
            ]}
            theme={theme}
            avatarProps={{ image: '/demo-assets/persona.png', alt: 'Avatar' }}
            date="4 hours ago"
            name="Emmitt O. Lum"
            text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
        >
            <CommentBlock
                hasActions
                actions={
                    <Button theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                        24 likes
                    </Button>
                }
                avatarProps={{ image: '/demo-assets/persona.png', alt: 'Avatar' }}
                date="3 hours ago"
                name="Jackson Ray"
                theme={theme}
                text="Here, I focus on a range of items and features that we use in life without giving them."
            />
            <CommentBlock
                hasActions
                actions={
                    <Button theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                        16 likes
                    </Button>
                }
                avatarProps={{ image: '/demo-assets/persona.png', alt: 'Avatar' }}
                date="2 hours ago"
                name="Hettie Powell"
                theme={theme}
                text="Differentiate and you stand out in a crowded marketplace."
            />
        </CommentBlock>

        <CommentBlock
            hasActions
            actions={[
                <Button key="button0" theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                    24 likes
                </Button>,
                <Button key="button1" theme={theme} emphasis={Emphasis.low} size={Size.s} leftIcon={mdiReply}>
                    2 replies
                </Button>,
            ]}
            theme={theme}
            avatarProps={{ image: '/demo-assets/persona.png', alt: 'Avatar' }}
            date="4 hours ago"
            name="Emmitt O. Lum"
            text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
        />
    </>
);
