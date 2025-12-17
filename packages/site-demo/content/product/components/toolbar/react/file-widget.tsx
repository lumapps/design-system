import { mdiChevronLeft, mdiMagnify, mdiOpenInNew, mdiSort } from '@lumx/icons';

import {
    Alignment,
    Button,
    Emphasis,
    FlexBox,
    IconButton,
    Orientation,
    TextField,
    Toolbar,
    Size,
    Theme,
} from '@lumx/react';

import classNames from 'classnames';
import { useState } from 'react';

export const App = ({ theme = Theme.light }: any) => {
    const [value, setValue] = useState('');

    return (
        <Toolbar
            before={<IconButton label="Previous" emphasis={Emphasis.low} theme={theme} icon={mdiChevronLeft} />}
            label={
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center} gap={Size.regular}>
                    <span
                        className={classNames(
                            'lumx-typography-title',
                            theme === 'light' ? 'lumx-color-font-dark-N' : 'lumx-color-font-light-N',
                        )}
                    >
                        Folder name
                    </span>
                    <IconButton label="Previous" emphasis={Emphasis.low} theme={theme} icon={mdiOpenInNew} />
                </FlexBox>
            }
            after={
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center} gap={Size.regular}>
                    <TextField value={value} onChange={setValue} icon={mdiMagnify} theme={theme} />
                    <IconButton label="Grid" emphasis={Emphasis.low} theme={theme} icon={mdiSort} />
                    <Button theme={theme}>New</Button>
                </FlexBox>
            }
        />
    );
};
