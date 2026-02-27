import { Button, FlexBox, Heading, IconButton, Link, Text } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { setup } from '@lumx/core/js/utils/action-area/Stories';

const { meta, ...stories } = setup({
    components: { FlexBox, Button, Heading, Link, Text, IconButton },
    decorators: { withCombinations, withThemedBackground },
});

export default { title: 'utils/action-area', ...meta };

export const CardExample = { ...stories.CardExample };
export const OverlayStates = { ...stories.OverlayStates };
