import React, { CSSProperties, ReactElement, useState } from 'react';

import { mdiInformation } from '@mdi/js';
import { ExpansionPanel, Icon, Size, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

const headerStyle: CSSProperties = {
    display: 'flex',
};

const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ExpansionPanel theme={theme} isOpen={isOpen} toggleCallback={setIsOpen}>
            <header style={headerStyle}>
                <span>Header text</span>
                <Icon size={Size.s} icon={mdiInformation} />
            </header>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu sem et mauris convallis tempor. Mauris
            placerat enim eget ligula fermentum, in aliquam lorem congue. Vivamus lacinia consectetur mollis.
        </ExpansionPanel>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
