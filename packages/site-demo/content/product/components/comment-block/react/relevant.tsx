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
                Reply
            </Button>,
        ]}
        hasActions={true}
        theme={theme}
        isRelevant={true}
        avatar="http://i.pravatar.cc/72"
        date="4 hours ago"
        name="Matthias Manoukian"
        hasChildren={true}
        onMouseEnter={console.log('Mouse entered')}
        onMouseLeave={console.log('Mouse left')}
        text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
    />
);

export default App;
