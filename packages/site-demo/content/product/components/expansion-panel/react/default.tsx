import React, { useState } from 'react';

import classNames from 'classnames';

import { ExpansionPanel } from '@lumx/react';

const App = ({ theme }) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <ExpansionPanel hasBackground label="Lorem ipsum" theme={theme} isOpen={isOpen} toggleCallback={setOpen}>
                <div className="lumx-spacing-padding-big lumx-spacing-padding-top-none">
                    <p
                        className={classNames(
                            'lumx-typography-subtitle1',
                            theme === 'light' ? 'lumx-theme-color-dark-N' : 'lumx-theme-color-light-N',
                        )}
                    >
                        Curabitur est gravida et libero vitae dictum.
                    </p>

                    <p
                        className={classNames(
                            'lumx-typography-body1',
                            theme === 'light' ? 'lumx-theme-color-dark-N' : 'lumx-theme-color-light-N',
                        )}
                    >
                        Etiam habebis sem dicantur magna mollis euismod.
                    </p>
                </div>
            </ExpansionPanel>
        </>
    );
};

export default App;
