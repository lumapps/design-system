import React from 'react';

import { mdiHeart, mdiReply } from '@lumx/icons';
import { Button, CommentBlock, Emphasis, Size } from '@lumx/react';

const App = ({ theme }: any) => (
    <CommentBlock
        actions={[
            <Button key="button0" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                24 likes
            </Button>,
            <Button key="button1" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiReply}>
                2 replies
            </Button>,
        ]}
        hasActions={true}
        theme={theme}
        avatar="../avatar/assets/persona.png"
        date="4 hours ago"
        name="Matthias Manoukian"
        hasChildren={true}
        isOpen={true}
        children={[
            <CommentBlock
                key="commentBlock0"
                actions={
                    <Button emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                        24 likes
                    </Button>
                }
                hasActions={true}
                avatar="../avatar/assets/persona.png"
                date="3 hours ago"
                name="Jackson Ray"
                theme={theme}
                text="Here, I focus on a range of items and features that we use in life without giving them."
            />,
            <CommentBlock
                key="commentBlock1"
                actions={
                    <Button emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                        16 likes
                    </Button>
                }
                hasActions={true}
                avatar="../avatar/assets/persona.png"
                date="2 hours ago"
                name="Hettie Powell"
                theme={theme}
                text="Differentiate and you stand out in a crowded marketplace."
            />,
        ]}
        text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
    />
);

export default App;
