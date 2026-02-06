import React from 'react';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { Button, Icon } from '@lumx/react';
import { mdiEarth, mdiHeart } from '@lumx/icons';
import { setup } from '@lumx/core/js/components/Text/Stories';

import { Text } from './Text';

const {
    meta,
    Base,
    LongText,
    NoWrap,
    AllWhiteSpace,
    Truncate,
    TruncateMultiline,
    AllTypography,
    AllColors,
    TestUpdateTruncateTitleLabel,
    WithIcon,
} = setup({
    component: Text,
    decorators: { withWrapper, withCombinations, withResizableBox },
    overrides: {
        TestUpdateTruncateTitleLabel: {
            render(args: any) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [content, setContent] = React.useState<string>('Some text');
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const lengthen = React.useCallback(
                    () => setContent((prevContent) => `${prevContent} ${prevContent}`),
                    [],
                );
                return (
                    <>
                        <Button onClick={lengthen}>Lengthen text</Button>
                        <Text as="p" truncate style={{ maxWidth: 300 }} {...args}>
                            {content}
                        </Text>
                    </>
                );
            },
        },
        WithIcon: {
            args: {
                children: (
                    <>
                        Some text <Icon icon={mdiHeart} /> with icons <Icon icon={mdiEarth} />
                    </>
                ),
            },
        },
    },
});

export default {
    title: 'LumX components/text/Text',
    ...meta,
};

export {
    Base,
    LongText,
    NoWrap,
    AllWhiteSpace,
    Truncate,
    TruncateMultiline,
    AllTypography,
    AllColors,
    TestUpdateTruncateTitleLabel,
    WithIcon,
};
