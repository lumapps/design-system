import '../../src/core/style/lumx-theme-lumapps.scss';

import React, { ReactElement } from 'react';

import Content from './content.mdx';

/////////////////////////////

/**
 * The main application component.
 * This component define the structure of the page (main navigation, sub navigation and main display).
 * It also handle the changes of the theme and the changes of the active component demo page (which will be displayed
 * in the main display component).
 *
 * @return The main application component.
 */
const AppWithMarkdown: React.FC = (): ReactElement => <Content />;

/////////////////////////////

export { AppWithMarkdown };
