import React from 'react';

import { Button, FlexBox, GridColumn, ProgressCircular, TextField } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';

import { useIconLibrary } from './useIconLibrary';
import { IconBlock } from './IconBlock';

import './IconLibrary.scss';

const COLUMNS = 4;
const ROWS = 10;
const MAX_COUNT = COLUMNS * ROWS;

/**
 * Display all LumX icons with search
 */
export function IconLibrary() {
    const [searchText, setSearchText] = React.useState('');

    const { icons, onLoadMore } = useIconLibrary(searchText, { maxCount: MAX_COUNT });

    return (
        <FlexBox className="icon-library" gap="big" orientation="vertical">
            <TextField onChange={setSearchText} value={searchText} icon={mdiMagnify} label="Search an icon" />

            {!icons && (
                // Loading state
                <FlexBox marginAuto={['left', 'right']}>
                    <ProgressCircular />
                </FlexBox>
            )}

            <GridColumn maxColumns={4} gap="regular" itemMinWidth={150}>
                {icons?.map(({ name, path }) => <IconBlock key={name} name={name} path={path} />)}
            </GridColumn>

            {onLoadMore && (
                <Button onClick={onLoadMore} emphasis="medium">
                    Load more
                </Button>
            )}
        </FlexBox>
    );
}
