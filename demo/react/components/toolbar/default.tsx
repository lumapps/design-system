import React, { Fragment } from 'react';

import { ButtonEmphasis, IconButton, TextField, Toolbar } from 'LumX';

import { mdiEyeSettingsOutline, mdiFolderEdit, mdiMagnify } from '@mdi/js';
import classNames from 'classnames';

import { Theme } from 'LumX/demo/constants';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

const toolbarGridDemoStyle = {
    'align-items': 'center',
    display: 'flex',
    'flex-direction': 'row',
};

/////////////////////////////

// tslint:disable-next-line: typedef
const getToolbarLabel = (theme) => (
    <div style={toolbarGridDemoStyle}>
        <span
            className={classNames(
                'lumx-typography-title',
                { 'lumx-theme-color-light-N': theme === 'dark' },
                { 'lumx-theme-color-dark-N': theme === 'light' },
            )}
        >
            Toolbar title
        </span>
        <TextField icon={mdiMagnify} theme={theme} className="lumx-spacing-margin-left-big" />
    </div>
);

// tslint:disable-next-line: typedef
const getToolbarAfterButton = (theme) => (
    <IconButton
        emphasis={ButtonEmphasis.low}
        theme={theme}
        icon={mdiFolderEdit}
        color={theme === 'dark' ? 'light' : undefined}
    />
);

// tslint:disable-next-line: typedef
const getToolbarBeforeButton = (theme) => (
    <IconButton
        emphasis={ButtonEmphasis.low}
        theme={theme}
        icon={mdiEyeSettingsOutline}
        color={theme === 'dark' ? 'light' : undefined}
    />
);

/**
 * The demo for the default <Toolbar>s.
 *
 * @param props Component props.
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (props: IProps): React.ReactElement => (
    <Fragment>
        <Toolbar
            label={getToolbarLabel(props.theme)}
            after={getToolbarAfterButton(props.theme)}
            before={getToolbarBeforeButton(props.theme)}
            theme={props.theme}
        />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
