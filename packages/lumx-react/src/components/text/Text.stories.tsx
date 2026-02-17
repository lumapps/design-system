import React from 'react';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { Button, Icon } from '@lumx/react';
import { setup } from '@lumx/core/js/components/Text/Stories';

import { Text } from './Text';

const { meta, ...stories } = setup({
    component: Text,
    components: { Icon },
    decorators: { withCombinations, withResizableBox },
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
    },
});

export default {
    title: 'LumX components/text/Text',
    ...meta,
};

export const Base = { ...stories.Base };
export const LongText = { ...stories.LongText };
export const NoWrap = { ...stories.NoWrap };
export const AllWhiteSpace = { ...stories.AllWhiteSpace };
export const Truncate = { ...stories.Truncate };
export const TruncateMultiline = { ...stories.TruncateMultiline };
export const AllTypography = { ...stories.AllTypography };
export const AllColors = { ...stories.AllColors };
export const TestUpdateTruncateTitleLabel = { ...stories.TestUpdateTruncateTitleLabel };
export const WithIcon = { ...stories.WithIcon };
