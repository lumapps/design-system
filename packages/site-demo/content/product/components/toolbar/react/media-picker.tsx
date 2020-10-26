import { mdiMagnify, mdiViewGrid } from '@lumx/icons';

import { Alignment, Button, Emphasis, FlexBox, IconButton, Orientation, TextField, Toolbar } from '@lumx/react';

import classNames from 'classnames';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return (
        <Toolbar
            label={
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <span
                        className={classNames(
                            'lumx-typography-title',
                            theme === 'light' ? 'lumx-color-font-dark-N' : 'lumx-color-font-light-N',
                        )}
                    >
                        Toolbar title
                    </span>

                    <TextField
                        className="lumx-spacing-margin-left-big"
                        value={value}
                        onChange={setValue}
                        icon={mdiMagnify}
                        theme={theme}
                    />
                </FlexBox>
            }
            after={
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <IconButton
                        className="lumx-spacing-margin-right-regular"
                        emphasis={Emphasis.low}
                        theme={theme}
                        icon={mdiViewGrid}
                    />

                    <Button theme={theme}>Action</Button>
                </FlexBox>
            }
        />
    );
};
