import { mdiAccount, mdiBee, mdiHeart } from '@lumx/icons';
import { Badge, BadgeWrapper, Button, Chip, ColorPalette, FlexBox, Icon, Orientation, Size } from '@lumx/react';
import { setup } from '@lumx/core/js/components/Badge/BadgeWrapperStories';

const { meta, ...stories } = setup({
    component: BadgeWrapper,
    overrides: {
        WithIcon: {
            args: {
                badge: (
                    <Badge color={ColorPalette.red}>
                        <Icon icon={mdiHeart} />
                    </Badge>
                ),
                children: <Icon icon={mdiAccount} size={Size.m} color={ColorPalette.dark} />,
            },
        },
        WithButton: {
            args: {
                badge: (
                    <Badge color={ColorPalette.red}>
                        <Icon icon={mdiHeart} />
                    </Badge>
                ),
                children: <Button>Some button</Button>,
            },
        },
    },
});

export default {
    title: 'LumX components/badge/BadgeWrapper',
    ...meta,
};

export const WithIcon = { ...stories.WithIcon };
export const WithButton = { ...stories.WithButton };

export const WithChip = {
    args: {
        badge: (
            <Badge color={ColorPalette.red}>
                <Icon icon={mdiHeart} />
            </Badge>
        ),
        children: <Chip>Some chip</Chip>,
    },
};

const InFlexbox = ({ orientation }: { orientation: Orientation }) => (
    <FlexBox orientation={orientation} gap={Size.medium} vAlign="left">
        <BadgeWrapper
            badge={
                <Badge color={ColorPalette.yellow}>
                    <Icon icon={mdiBee} />
                </Badge>
            }
        >
            <Chip color={ColorPalette.green}>Some chip</Chip>
        </BadgeWrapper>
        <BadgeWrapper
            badge={
                <Badge color={ColorPalette.red}>
                    <Icon icon={mdiHeart} />
                </Badge>
            }
        >
            <Chip color={ColorPalette.blue}>Some other chip</Chip>
        </BadgeWrapper>
    </FlexBox>
);

export const InVerticalFlexbox = () => <InFlexbox orientation={Orientation.vertical} />;
export const InHorizontalFlexbox = () => <InFlexbox orientation={Orientation.horizontal} />;
