import React from 'react';

import { Mosaic } from './Mosaic';

export default { title: 'Mosaic' };

export const twoThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic theme={theme} thumbnails={['https://picsum.photos/200', 'https://picsum.photos/210']} />
        </div>
    );
};

export const threeThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic
                theme={theme}
                thumbnails={['https://picsum.photos/200', 'https://picsum.photos/210', 'https://picsum.photos/220']}
            />
        </div>
    );
};

export const fourThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    'https://picsum.photos/200',
                    'https://picsum.photos/210',
                    'https://picsum.photos/220',
                    'https://picsum.photos/230',
                ]}
            />
        </div>
    );
};

export const sixThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    'https://picsum.photos/200',
                    'https://picsum.photos/210',
                    'https://picsum.photos/220',
                    'https://picsum.photos/230',
                    'https://picsum.photos/240',
                    'https://picsum.photos/250',
                ]}
            />
        </div>
    );
};
