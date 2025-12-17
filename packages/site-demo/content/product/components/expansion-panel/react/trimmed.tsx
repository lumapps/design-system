import { ExpansionPanel, Text, Theme } from '@lumx/react';

import { useState } from 'react';

export const App = ({ theme = Theme.light }: any) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <ExpansionPanel
            label="Lorem ipsum"
            theme={theme}
            isOpen={isOpen}
            onToggleOpen={setOpen}
            toggleButtonProps={{ label: 'Toggle' }}
        >
            <div className="lumx-spacing-padding-top">
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
