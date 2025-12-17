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
import { useState } from 'react';

const RESULTS = [
    {
        thumbnail: '/demo-assets/square1.jpg',
        label: 'Apple Juice',
        city: 'Perth',
    },
    {
        thumbnail: '/demo-assets/square2.jpg',
        label: 'Apple pie',
        city: 'Zurich',
    },
    {
        thumbnail: '/demo-assets/square1.jpg',
        label: 'Kiwi juie',
        city: 'Bologna',
    },
    {
        thumbnail: '/demo-assets/square2.jpg',
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
                        before={
                            <Thumbnail
                                variant={ThumbnailVariant.rounded}
                                alt={result.label}
                                image={result.thumbnail}
                                size={Size.m}
                            />
                        }
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
