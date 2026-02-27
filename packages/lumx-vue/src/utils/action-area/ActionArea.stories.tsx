import { Button, FlexBox, Heading, IconButton, Link, Text } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/vue/stories/decorators/withThemedBackground';
import { setup } from '@lumx/core/js/utils/action-area/Stories';

const { meta, ...stories } = setup({
    classProp: 'class',
    components: { FlexBox, Button, Heading, Link, Text, IconButton },
    decorators: { withCombinations, withThemedBackground },
});

export default { title: 'utils/action-area', ...meta };

export const CardExample = { ...stories.CardExample };
export const OverlayStates = { ...stories.OverlayStates };
