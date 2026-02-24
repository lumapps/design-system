import { mdiMagnify } from '@lumx/icons';
import { classNames } from '@lumx/core/js/utils';
import { Popover, TextField } from '@lumx/react';
import React, { useRef } from 'react';

export default () => {
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
                    textFieldRef={anchorRef}
                />
            </div>
            <Popover
                isOpen
                className={classNames.padding('huge')}
                anchorRef={anchorRef}
                placement="bottom-start"
                fitToAnchorWidth
            >
                Popover&apos;s width matching anchor&apos;s
            </Popover>
        </>
    );
};
