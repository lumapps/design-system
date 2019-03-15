import React, { Fragment } from 'react';

import { LxButton, LxButtonGroup, LxIcon, LxIconButton } from 'LumX';
import { mdiCheck, mdiMenuDown, mdiPencil, mdiPlus } from 'LumX/icons';

/////////////////////////////

/**
 * The <LxButton> demo component.
 * This component will display a demo of all possible configuration of the <LxButton>.
 */
const LxButtonDemo = () => (
    <Fragment>
        {/* Theme light (m) */}

        <div className="p++ lx-theme-background-dark-L6">
            <LxButton>Default</LxButton>

            <LxButton disabled={true}>Disabled</LxButton>

            <LxButton>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton>Split</LxButton>
                <LxButton variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-L6">
            <LxButton emphasis="medium">Default</LxButton>

            <LxButton emphasis="medium" disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis="medium">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis="medium">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton emphasis="medium">Split</LxButton>

                <LxButton emphasis="medium" variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton emphasis="medium" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis="medium">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-L6">
            <LxButton emphasis="low">Default</LxButton>

            <LxButton emphasis="low" disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis="low">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis="low">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButton emphasis="low" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis="low">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-L6">
            <LxButton size="s">Default</LxButton>

            <LxButton size="s" disabled={true}>
                Disabled
            </LxButton>

            <LxButton size="s">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton size="s">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton size="s">Split</LxButton>

                <LxButton size="s" variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton size="s" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton size="s">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        {/* Theme light (s) */}

        <div className="p++ lx-theme-background-dark-L6">
            <LxButton emphasis="medium" size="s">
                Default
            </LxButton>

            <LxButton emphasis="medium" size="s" disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis="medium" size="s">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis="medium" size="s">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton emphasis="medium" size="s">
                    Split
                </LxButton>

                <LxButton emphasis="medium" size="s" variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton emphasis="medium" size="s" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis="medium" size="s">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-L6">
            <LxButton emphasis="low" size="s">
                Default
            </LxButton>

            <LxButton emphasis="low" size="s" disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis="low" size="s">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis="low" size="s">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButton emphasis="low" size="s" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis="low" size="s">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        {/* Theme dark (m) */}

        <div className="p++ lx-theme-background-dark-N">
            <LxButton theme="dark">Default</LxButton>

            <LxButton theme="dark" disabled={true}>
                Disabled
            </LxButton>

            <LxButton theme="dark">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton theme="dark">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton theme="dark">Split</LxButton>

                <LxButton theme="dark" variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton theme="dark" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton theme="dark">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-N">
            <LxButton color="light" emphasis="medium">
                Default
            </LxButton>

            <LxButton color="light" emphasis="medium" disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis="medium">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis="medium">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton color="light" emphasis="medium">
                    Split
                </LxButton>

                <LxButton color="light" emphasis="medium" variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton color="light" emphasis="medium" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis="medium">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-N">
            <LxButton color="light" emphasis="low">
                Default
            </LxButton>

            <LxButton color="light" emphasis="low" disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis="low">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis="low">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButton color="light" emphasis="low" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis="low">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        {/* Theme dark (s) */}

        <div className="p++ lx-theme-background-dark-N">
            <LxButton size="s" theme="dark">
                Default
            </LxButton>

            <LxButton size="s" theme="dark" disabled={true}>
                Disabled
            </LxButton>

            <LxButton size="s" theme="dark">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton size="s" theme="dark">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton size="s" theme="dark">
                    Split
                </LxButton>

                <LxButton size="s" theme="dark" variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton size="s" theme="dark" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton size="s" theme="dark">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-N">
            <LxButton color="light" emphasis="medium" size="s">
                Default
            </LxButton>

            <LxButton color="light" emphasis="medium" size="s" disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis="medium" size="s">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis="medium" size="s">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton color="light" emphasis="medium" size="s">
                    Split
                </LxButton>

                <LxButton color="light" emphasis="medium" size="s" variant="icon">
                    <LxIcon icon={mdiMenuDown} />
                </LxButton>
            </LxButtonGroup>

            <LxButton color="light" emphasis="medium" size="s" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis="medium" size="s">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className="p++ lx-theme-background-dark-N">
            <LxButton color="light" emphasis="low" size="s">
                Default
            </LxButton>

            <LxButton color="light" emphasis="low" size="s" disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis="low" size="s">
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis="low" size="s">
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButton color="light" emphasis="low" size="s" variant="icon">
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis="low" size="s">
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>
    </Fragment>
);

/////////////////////////////

/*
 * Important Note: for the dynamic loading of the demo component in the Main component, you have to assign your
 * component as the default export of the module.
 */
export default LxButtonDemo;
