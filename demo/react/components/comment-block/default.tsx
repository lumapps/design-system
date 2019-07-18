import React, { FC, ReactElement, useState } from 'react';

import { Button, ButtonEmphasis, CommentBlock, Size, Theme } from 'LumX';
import { mdiHeart, mdiReply } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <CommentBlock>s.
 *
 * @return The demo component.
 */
const DemoComponent: FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <CommentBlock
            actions={[
                <Button key="button0" emphasis={ButtonEmphasis.low} size={Size.s} leftIcon={mdiHeart}>
                    24 likes
                </Button>,
                <Button
                    key="button1"
                    emphasis={ButtonEmphasis.low}
                    size={Size.s}
                    leftIcon={mdiReply}
                    onClick={(): void => setIsOpen(!isOpen)}
                >
                    16 replies
                </Button>,
            ]}
            hasActions={true}
            isOpen={isOpen}
            theme={theme}
            isRelevant={true}
            avatar="http://i.pravatar.cc/128"
            date="4 hours ago"
            name="Matthias Manoukian"
            hasChildren={true}
            onMouseEnter={(): void => console.log('Mouse entered')}
            onMouseLeave={(): void => console.log('Mouse left')}
            onClick={(): void => console.log('CommentBlock clicked')}
            children={[
                <CommentBlock
                    key="commentBlock0"
                    actions={
                        <Button emphasis={ButtonEmphasis.low} size={Size.s} leftIcon={mdiHeart}>
                            24 likes
                        </Button>
                    }
                    onMouseEnter={(): void => console.log('Mouse entered')}
                    onMouseLeave={(): void => console.log('Mouse left')}
                    onClick={(): void => console.log('CommentBlock clicked')}
                    hasActions={true}
                    avatar="http://i.pravatar.cc/128"
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
                    avatar="http://i.pravatar.cc/128"
                    date="2 hours ago"
                    name="Hettie Powell"
                    theme={theme}
                    onMouseEnter={(): void => console.log('Mouse entered')}
                    onMouseLeave={(): void => console.log('Mouse left')}
                    onClick={(): void => console.log('CommentBlock clicked')}
                    text="Differentiate and you stand out in a crowded marketplace."
                />,
            ]}
            text="All the rumors have finally died down and many skeptics have tightened their lips, the iPod does support video format now on its fifth generation."
        />
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
