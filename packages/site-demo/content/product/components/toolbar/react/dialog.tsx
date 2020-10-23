import { mdiMenuDown, mdiTranslate } from '@lumx/icons';

import { Button, Emphasis, Toolbar } from '@lumx/react';

import classNames from 'classnames';
import React from 'react';

const App = ({ theme }: any) => (
    <Toolbar
        label={
            <span
                className={classNames(
                    'lumx-typography-title',
                    theme === 'light' ? 'lumx-color-font-dark-N' : 'lumx-color-font-light-N',
                )}
            >
                Toolbar title
            </span>
        }
        after={
            <Button emphasis={Emphasis.low} theme={theme} leftIcon={mdiTranslate} rightIcon={mdiMenuDown}>
                Value
            </Button>
        }
    />
);

export default App;
