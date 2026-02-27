import { mdiMagnify } from '@lumx/icons';
import { classNames } from '@lumx/core/js/utils';
import { Popover, TextField, type Theme } from '@lumx/react';
import React, { useRef } from 'react';

export default ({ theme }: { theme?: Theme }) => {
    const [searchValue, setSearchValue] = React.useState('');
    const anchorRef = useRef(null);
    return (
        <>
            <div style={{ marginBottom: 80 }}>
                <TextField
                    placeholder="Search"
                    value={searchValue}
                    onChange={setSearchValue}
                    icon={mdiMagnify}
                    theme={theme}
                    textFieldRef={anchorRef}
                />
            </div>
            <Popover
                isOpen
                className={classNames.padding('huge')}
                theme={theme}
                anchorRef={anchorRef}
                placement="bottom-start"
                fitToAnchorWidth
            >
                Popover&apos;s width matching anchor&apos;s
            </Popover>
        </>
    );
};
