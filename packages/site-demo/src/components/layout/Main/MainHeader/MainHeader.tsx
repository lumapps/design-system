import React from 'react';
import { Match } from '@reach/router';
import { MaterialThemeSwitcher } from '@lumx/react/utils/MaterialThemeSwitcher';
import { LumxVersion } from './LumxVersion';

import './MainHeader.scss';

export const MainHeader = () => (
    <div className="main-header">
        <Match path="/product/*">
            {({ match }) =>
                match && (
                    <>
                        <MaterialThemeSwitcher />
                        <LumxVersion />
                    </>
                )
            }
        </Match>
    </div>
);
