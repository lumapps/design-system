import { ExpansionPanel } from '@lumx/react';

import classNames from 'classnames';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <ExpansionPanel label="Lorem ipsum" theme={theme} isOpen={isOpen} onToggleOpen={setOpen}>
            <div className="lumx-spacing-padding-top">
                <p
                    className={classNames(
                        'lumx-typography-subtitle1',
                        theme === 'light' ? 'lumx-color-font-dark-N' : 'lumx-color-font-light-N',
                    )}
                >
                    Curabitur est gravida et libero vitae dictum.
                </p>

                <p
                    className={classNames(
                        'lumx-typography-body1',
                        theme === 'light' ? 'lumx-color-font-dark-N' : 'lumx-color-font-light-N',
                    )}
                >
                    Etiam habebis sem dicantur magna mollis euismod.
                </p>
            </div>
        </ExpansionPanel>
    );
};
