import { DragHandle, ExpansionPanel, Text } from '@lumx/react';

import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <ExpansionPanel
            hasBackground
            label="Lorem ipsum"
            theme={theme}
            isOpen={isOpen}
            onToggleOpen={setOpen}
            toggleButtonProps={{ label: 'Toggle' }}
        >
            <DragHandle theme={theme} />

            <div className="lumx-spacing-padding-big lumx-spacing-padding-top-none">
                <Text as="p" typography="subtitle1" color={theme === 'light' ? 'dark' : 'light'}>
                    Curabitur est gravida et libero vitae dictum.
                </Text>

                <Text as="p" typography="subtitle1" color={theme === 'light' ? 'dark' : 'light'}>
                    Etiam habebis sem dicantur magna mollis euismod.
                </Text>
            </div>
        </ExpansionPanel>
    );
};
