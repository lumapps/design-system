import React from 'react';

/** Storybook decorator wrapping story in a resizable box  */
// eslint-disable-next-line react/display-name
export const withResizableBox = ({ width = 150, height = 50 } = {}) => (Story: any) => (
    <div
        style={{
            display: 'flex',
            width,
            height,
            border: '1px solid red',
            resize: 'both',
            overflow: 'hidden',
        }}
    >
        <Story />
    </div>
);
