import React from 'react';

import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Avatar, Emphasis, IconButton, Size } from '@lumx/react';

const App = ({ theme }: any) => (
    <div className="demo-grid">
        <Avatar
            theme={theme}
            image="./assets/persona.png"
            size={Size.xl}
            actions={
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="lumx-spacing-margin-right-regular">
                        <IconButton
                            color="dark"
                            emphasis={Emphasis.low}
                            hasBackground={true}
                            icon={mdiPencil}
                            size={Size.s}
                        />
                    </div>

                    <div className="lumx-spacing-margin-right-regular">
                        <IconButton
                            color="dark"
                            emphasis={Emphasis.low}
                            hasBackground={true}
                            icon={mdiEye}
                            size={Size.s}
                        />
                    </div>

                    <div>
                        <IconButton
                            color="dark"
                            emphasis={Emphasis.low}
                            hasBackground={true}
                            icon={mdiDelete}
                            size={Size.s}
                        />
                    </div>
                </div>
            }
        />
    </div>
);

export default App;
