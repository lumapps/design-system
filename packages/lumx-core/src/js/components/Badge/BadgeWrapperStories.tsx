import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { mdiAccount, mdiHeart } from '@lumx/icons';
import { ColorPalette, Size } from '../../constants';
import { DEFAULT_PROPS } from './BadgeWrapper';

/**
 * Setup BadgeWrapper stories for a specific framework (React or Vue).
 * Framework-specific components (Badge, Icon, Button) are injected via `components`.
 */
export function setup({
    component: BadgeWrapper,
    components: { Badge, Icon, Button },
}: SetupStoriesOptions<{
    components: { Badge: any; Icon: any; Button: any };
}>) {
    const meta = {
        component: BadgeWrapper,
        render: (args: any) => <BadgeWrapper {...args} />,
        argTypes: {
            children: { control: false },
        },
        args: DEFAULT_PROPS,
    };

    /** Using badge wrapper with icon */
    const WithIcon = {
        render: (args: any) => (
            <BadgeWrapper
                {...args}
                badge={
                    <Badge color={ColorPalette.red}>
                        <Icon icon={mdiHeart} />
                    </Badge>
                }
            >
                <Icon icon={mdiAccount} size={Size.m} color={ColorPalette.dark} />
            </BadgeWrapper>
        ),
    };

    /** Using badge wrapper with button */
    const WithButton = {
        render: (args: any) => (
            <BadgeWrapper
                {...args}
                badge={
                    <Badge color={ColorPalette.red}>
                        <Icon icon={mdiHeart} />
                    </Badge>
                }
            >
                <Button>Some button</Button>
            </BadgeWrapper>
        ),
    };

    return { meta, WithIcon, WithButton };
}
