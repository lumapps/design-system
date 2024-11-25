import React from 'react';

const LIGHT_BACKGROUND_COLOR = '#EEE';
const DARK_BACKGROUND_COLOR = '#333';

/**
 * SB decorator adding a background adapted to the current theme.
 */
export const withThemedBackground = () => {
    return (Story: any, { args }: any) => {
        const backgroundColor = args.theme === 'dark' ? DARK_BACKGROUND_COLOR : LIGHT_BACKGROUND_COLOR;
        return (
            <div style={{ backgroundColor, padding: 8 }}>
                <Story />
            </div>
        );
    };
};
