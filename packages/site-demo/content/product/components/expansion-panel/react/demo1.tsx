import { useState } from 'react';
import { classNames } from '@lumx/core/js/utils';
import { ExpansionPanel, Text, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
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
            <div className={classNames.join(classNames.padding('big'), classNames.padding('top', null))}>
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
