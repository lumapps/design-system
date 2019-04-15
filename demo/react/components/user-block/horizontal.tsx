import React from 'react';

import { Button, ButtonEmphasises, ButtonSizes, ButtonThemes, UserBlock, UserBlockSize, UserBlockTheme } from 'LumX';
import { ORIENTATIONS } from 'LumX/core/react/constants';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: UserBlockTheme;
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
 * @param {ButtonThemes} theme Theme to be used
 * @return {React.ReactElement} an action button
 */
const createSimpleAction: React.FC<ButtonThemes> = (
    theme: ButtonThemes,
): any => ( // tslint:disable-line
    <Button
        emphasis={ButtonEmphasises.medium}
        color={theme === ButtonThemes.dark ? 'light' : undefined}
        size={ButtonSizes.s}
        theme={theme}
    >
        Follow
    </Button>
);

/////////////////////////////

/**
 * The demo for the default <UserBlock>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
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
                        orientation={ORIENTATIONS.horizontal}
                        size={UserBlockSize.s}
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
                        orientation={ORIENTATIONS.horizontal}
                        size={UserBlockSize.m}
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
                        orientation={ORIENTATIONS.horizontal}
                        size={UserBlockSize.l}
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
