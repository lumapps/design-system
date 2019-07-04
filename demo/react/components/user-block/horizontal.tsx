import React, { ReactElement } from 'react';

import { Button, ButtonEmphasis, Orientation, Size, Theme, UserBlock } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

interface IFakeUser {
    name: string;
    fields: string[];
}

const fakeUsers: IFakeUser[] = [
    { name: 'Natalie Weaver', fields: ['Automotive repairer', 'Amarillo, TX'] },
    { name: 'John B. Thomson', fields: ['Record clerk', 'Hampton, CT'] },
    { name: 'Nicole G. Haider', fields: ['Lens grinder', 'Poznań'] },
];

/**
 * This action button should not be rendered in horizontal layout.
 *
 * @param theme Theme to be used
 * @return an action button
 */
const createSimpleAction = (theme: Theme): Button => (
    <Button
        emphasis={ButtonEmphasis.medium}
        color={theme === Theme.dark ? 'light' : undefined}
        size={Size.s}
        theme={theme}
    >
        Follow
    </Button>
);

/////////////////////////////

/**
 * The demo for the default <UserBlock>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
            <pre>size: s</pre>
            {fakeUsers.map((aUser: IFakeUser, idx: number) => (
                <div key={`user${idx}`} style={{ marginTop: 8 }}>
                    <UserBlock
                        theme={theme}
                        name={aUser.name}
                        fields={aUser.fields}
                        avatar={`http://i.pravatar.cc/13${idx}`}
                        orientation={Orientation.horizontal}
                        size={Size.s}
                        simpleAction={createSimpleAction(theme)}
                    />
                </div>
            ))}
        </div>
        <div>
            <pre>size : m</pre>
            {fakeUsers.map((aUser: IFakeUser, idx: number) => (
                <div key={`user${idx}`} style={{ marginTop: 8 }}>
                    <UserBlock
                        theme={theme}
                        name={aUser.name}
                        fields={aUser.fields}
                        avatar={`http://i.pravatar.cc/13${idx}`}
                        orientation={Orientation.horizontal}
                        size={Size.m}
                    />
                </div>
            ))}
        </div>
        <div>
            <pre>size : l</pre>
            {fakeUsers.map((aUser: IFakeUser, idx: number) => (
                <div key={`user${idx}`} style={{ marginTop: 8 }}>
                    <UserBlock
                        theme={theme}
                        name={aUser.name}
                        fields={aUser.fields}
                        avatar={`http://i.pravatar.cc/13${idx}`}
                        orientation={Orientation.horizontal}
                        size={Size.l}
                    />
                </div>
            ))}
        </div>
    </div>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
