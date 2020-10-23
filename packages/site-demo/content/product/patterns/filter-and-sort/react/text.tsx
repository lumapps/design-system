import { mdiMagnify } from '@lumx/icons';
import {
    Alignment,
    FlexBox,
    List,
    ListItem,
    Orientation,
    Size,
    TextField,
    Thumbnail,
    ThumbnailVariant,
} from '@lumx/react';
import React, { useState } from 'react';

const RESULTS = [
    {
        thumbnail: 'https://picsum.photos/id/1/72',
        label: 'Apple Juice',
        city: 'Perth',
    },
    {
        thumbnail: 'https://picsum.photos/id/2/72',
        label: 'Apple pie',
        city: 'Zurich',
    },
    {
        thumbnail: 'https://picsum.photos/id/3/72',
        label: 'Kiwi juie',
        city: 'Bologna',
    },
    {
        thumbnail: 'https://picsum.photos/id/4/72',
        label: 'Kiwi pie',
        city: 'Lima',
    },
];

export const App = () => {
    const [query, setQuery] = useState('');

    return (
        <FlexBox orientation={Orientation.vertical} vAlign={Alignment.left}>
            <TextField value={query} onChange={setQuery} icon={mdiMagnify} placeholder="Search" />

            <List>
                {RESULTS.map((result, index) => (
                    <ListItem
                        key={index}
                        size={Size.big}
                        before={<Thumbnail variant={ThumbnailVariant.rounded} image={result.thumbnail} size={Size.m} />}
                    >
                        <div>
                            <span>{result.label}</span>
                        </div>

                        <div>
                            <span className="lumx-color-font-dark-L2">{result.city}</span>
                        </div>
                    </ListItem>
                ))}
            </List>
        </FlexBox>
    );
};
