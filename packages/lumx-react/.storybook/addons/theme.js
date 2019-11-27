import React from 'react';
import { addons, types } from '@storybook/addons';

class ThemeSelector extends React.Component {
    render() {
        return <div>test</div>;
    }
}

const ADDON_ID = 'lumapps-theme';
const TOOL_ID = `${ADDON_ID}/tool`;

addons.register(ADDON_ID, (api) => {
    addons.add(TOOL_ID, {
        title: '',
        type: types.TOOL,
        match: ({ viewMode }) => viewMode === 'story',
        render: () => <ThemeSelector />,
    });
});
