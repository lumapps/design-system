import React from 'react';

import { Button, ButtonEmphasis, CommentBlock, Size } from '@lumx/react';
import { mdiHeart, mdiReply } from '@lumx/icons';

const App = ({ theme }) => (
    <CommentBlock
        actions={[
            <Button key="button0" emphasis={ButtonEmphasis.low} size={Size.s} leftIcon={mdiHeart}>
                24 likes
            </Button>,
            <Button key="button1" emphasis={ButtonEmphasis.low} size={Size.s} leftIcon={mdiReply}>
                2 replies
            </Button>,
        ]}
        hasActions={true}
        theme={theme}
        avatar="http://i.pravatar.cc/72"
        date="4 hours ago"
        name="Matthias Manoukian"
        hasChildren={true}
        isOpen={true}
        onMouseEnter={console.log('Mouse entered')}
        onMouseLeave={console.log('Mouse left')}
        children={[
            <CommentBlock
                key="commentBlock0"
                actions={
                    <Button emphasis={ButtonEmphasis.low} size={Size.s} leftIcon={mdiHeart}>
                        24 likes
                    </Button>
                }
                onMouseEnter={console.log('Mouse entered')}
                onMouseLeave={console.log('Mouse left')}
                hasActions={true}
                avatar="http://i.pravatar.cc/72/random"
                date="3 hours ago"
                name="Jackson Ray"
                theme={theme}
                text="Here, I focus on a range of items and features that we use in life without giving them."
            />,
            <CommentBlock
                key="commentBlock1"
                actions={
                    <Button emphasis={ButtonEmphasis.low} size={Size.s} leftIcon={mdiHeart}>
                        16 likes
                    </Button>
                }
                hasActions={true}
                avatar="http://i.pravatar.cc/72/women"
                date="2 hours ago"
                name="Hettie Powell"
                theme={theme}
                onMouseEnter={console.log('Mouse entered')}
                onMouseLeave={console.log('Mouse left')}
                text="Differentiate and you stand out in a crowded marketplace."
            />,
        ]}
        text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
    />
);

export default App;
