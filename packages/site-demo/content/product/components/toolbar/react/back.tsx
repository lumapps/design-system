import React, { useState } from 'react';

import classNames from 'classnames';

import { mdiChevronLeft, mdiMagnify, mdiViewGrid } from '@lumx/icons';

import { Alignment, Button, Emphasis, Grid, IconButton, TextField, Toolbar } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return (
        <Toolbar
            before={<IconButton emphasis={Emphasis.low} theme={theme} icon={mdiChevronLeft} />}
            label={
                <Grid hAlign={Alignment.center}>
                    <span
                        className={classNames(
                            'lumx-typography-title',
                            theme === 'light' ? 'lumx-theme-color-dark-N' : 'lumx-theme-color-light-N',
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
                </Grid>
            }
            after={
                <Grid hAlign={Alignment.center}>
                    <IconButton
                        className="lumx-spacing-margin-right-regular"
                        emphasis={Emphasis.low}
                        theme={theme}
                        icon={mdiViewGrid}
                    />

                    <Button theme={theme}>Action</Button>
                </Grid>
            }
        />
    );
};

export default App;
