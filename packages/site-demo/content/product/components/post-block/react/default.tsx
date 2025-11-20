import { mdiComment, mdiHeart } from '@lumx/icons';
import {
    Button,
    Chip,
    ChipGroup,
    ColorPalette,
    Emphasis,
    FlexBox,
    Orientation,
    PostBlock,
    Size,
    Theme,
    UserBlock,
} from '@lumx/react';

export const App = ({ theme = Theme.light }: any) => (
    <PostBlock
        actions={
            <FlexBox orientation={Orientation.horizontal}>
                <Button
                    color={theme === Theme.dark ? ColorPalette.light : undefined}
                    emphasis={Emphasis.low}
                    size={Size.s}
                    leftIcon={mdiComment}
                >
                    <span>16</span>
                </Button>

                <Button
                    color={theme === Theme.dark ? ColorPalette.light : undefined}
                    emphasis={Emphasis.low}
                    size={Size.s}
                    leftIcon={mdiHeart}
                >
                    <span>8</span>
                </Button>
            </FlexBox>
        }
        attachments={
            <UserBlock
                avatarProps={{ image: '/demo-assets/persona.png', alt: 'Avatar' }}
                name="Matthias Manoukian"
                fields={['Head of Design', 'Lyon']}
                orientation={Orientation.vertical}
                size={Size.l}
                theme={theme}
            />
        }
        author={
            <UserBlock
                avatarProps={{ image: '/demo-assets/avatar2.jpg', alt: 'Avatar' }}
                name="Matthias Manoukian"
                size={Size.s}
                theme={theme}
            />
        }
        tags={
            <ChipGroup>
                <Chip size={Size.s} theme={theme}>
                    tag1
                </Chip>

                <Chip size={Size.s} theme={theme}>
                    tag2
                </Chip>

                <Chip size={Size.s} theme={theme}>
                    tag3
                </Chip>
            </ChipGroup>
        }
        meta="1 day ago in community's name"
        text={{
            __html: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus libero aliquet pharetra luctus. Fusce nisl turpis, posuere ac tellus at, euismod vulputate libero...',
        }}
        theme={theme}
        thumbnailProps={{ image: '/demo-assets/landscape1.jpg', alt: 'Landscape' }}
        title="Annual Bonus Payments"
    />
);
