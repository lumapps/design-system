import React from 'react';

import { mdiComment, mdiHeart } from '@lumx/icons';
import {
    Button,
    Chip,
    ChipGroup,
    ColorPalette,
    Emphasis,
    Grid,
    Orientation,
    PostBlock,
    Size,
    Theme,
    UserBlock,
} from '@lumx/react';

const App = ({ theme }: any) => (
    <>
        <PostBlock
            actions={
                <Grid>
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
                </Grid>
            }
            attachments={
                <UserBlock
                    avatar="http://i.pravatar.cc/128"
                    name="Matthias Manoukian"
                    fields={['Head of Design', 'Lyon']}
                    orientation={Orientation.vertical}
                    size={Size.l}
                    theme={theme}
                />
            }
            author={
                <UserBlock avatar="http://i.pravatar.cc/128" name="Matthias Manoukian" size={Size.s} theme={theme} />
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
                __html:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus libero aliquet pharetra luctus. Fusce nisl turpis, posuere ac tellus at, euismod vulputate libero...',
            }}
            theme={theme}
            thumbnail="https://picsum.photos/800/600/?random"
            title="Annual Bonus Payments"
        />
    </>
);

export default App;
