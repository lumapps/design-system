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
                Reply
            </Button>,
        ]}
        hasActions={true}
        theme={theme}
        avatar="../avatar/assets/persona.png"
        date="4 hours ago"
        name="Matthias Manoukian"
        hasChildren={true}
        text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
    />
);

export default App;
