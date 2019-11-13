import React, { ReactElement, useState } from 'react';

import { ExpansionPanel, ExpansionPanelVariant, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ExpansionPanel
            theme={theme}
            label="Label text"
            variant={ExpansionPanelVariant.trimmed}
            isOpen={isOpen}
            toggleCallback={setIsOpen}
        >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu sem et mauris convallis tempor. Mauris
            placerat enim eget ligula fermentum, in aliquam lorem congue. Vivamus lacinia consectetur mollis.
        </ExpansionPanel>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
