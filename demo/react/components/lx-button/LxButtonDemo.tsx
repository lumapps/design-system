import React, { Fragment } from 'react';

import {
    LxButton,
    LxButtonEmphasises,
    LxButtonGroup,
    LxButtonVariants,
    LxDropdownButton,
    LxIcon,
    LxIconButton,
    Sizes,
    Themes,
} from 'LumX';
import { CSS_PREFIX } from 'LumX/core/constants';

import { mdiCheck, mdiMenuDown, mdiPencil, mdiPlus } from 'LumX/icons';

import {} from 'LumX/components/button/react/LxButton';

/////////////////////////////

/**
 * The <LxIconButton> demo component.
 * This component will display a demo of all possible configuration of the <LxIconButton>.
 */
const LxButtonDemo = () => (
    <Fragment>
        {/* Theme light (m) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <LxButton>Default</LxButton>

            <LxButton disabled={true}>Disabled</LxButton>

            <LxButton>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton>
                <span>Handmade dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxDropdownButton dropdown={<span>This is a dropdown</span>}>Dropdown button</LxDropdownButton>

            <LxButtonGroup>
                <LxButton>handmade splitted dropdown</LxButton>
                <LxIconButton>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxDropdownButton isSplitted={true} dropdown={<span>This is a dropdown</span>}>
                Splitted dropdown button
            </LxDropdownButton>

            <LxButton variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <LxButton emphasis={LxButtonEmphasises.medium}>Default</LxButton>

            <LxButton emphasis={LxButtonEmphasises.medium} disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.medium}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.medium}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton emphasis={LxButtonEmphasises.medium}>Split</LxButton>

                <LxIconButton emphasis={LxButtonEmphasises.medium}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton emphasis={LxButtonEmphasises.medium} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis={LxButtonEmphasises.medium}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <LxButton emphasis={LxButtonEmphasises.low}>Default</LxButton>

            <LxButton emphasis={LxButtonEmphasises.low} disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.low}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.low}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton emphasis={LxButtonEmphasises.low}>Split</LxButton>

                <LxIconButton emphasis={LxButtonEmphasises.low}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton emphasis={LxButtonEmphasises.low} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis={LxButtonEmphasises.low}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <LxButton size={Sizes.s}>Default</LxButton>

            <LxButton size={Sizes.s} disabled={true}>
                Disabled
            </LxButton>

            <LxButton size={Sizes.s}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton size={Sizes.s}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton size={Sizes.s}>Split</LxButton>

                <LxIconButton size={Sizes.s}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton size={Sizes.s} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton size={Sizes.s}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        {/* Theme light (s) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <LxButton emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                Default
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.medium} size={Sizes.s} disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                    Split
                </LxButton>

                <LxIconButton emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton emphasis={LxButtonEmphasises.medium} size={Sizes.s} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <LxButton emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                Default
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.low} size={Sizes.s} disabled={true}>
                Disabled
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                    Split
                </LxButton>

                <LxIconButton emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton emphasis={LxButtonEmphasises.low} size={Sizes.s} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        {/* Theme dark (m) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <LxButton theme={Themes.dark}>Default</LxButton>

            <LxButton theme={Themes.dark} disabled={true}>
                Disabled
            </LxButton>

            <LxButton theme={Themes.dark}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton theme={Themes.dark}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton theme={Themes.dark}>Split</LxButton>

                <LxIconButton theme={Themes.dark}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton theme={Themes.dark} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton theme={Themes.dark}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <LxButton color="light" emphasis={LxButtonEmphasises.medium}>
                Default
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium} disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton color="light" emphasis={LxButtonEmphasises.medium}>
                    Split
                </LxButton>

                <LxIconButton color="light" emphasis={LxButtonEmphasises.medium}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis={LxButtonEmphasises.medium}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <LxButton color="light" emphasis={LxButtonEmphasises.low}>
                Default
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.low} disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.low}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.low}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton color="light" emphasis={LxButtonEmphasises.low}>
                    Split
                </LxButton>

                <LxIconButton color="light" emphasis={LxButtonEmphasises.low}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton color="light" emphasis={LxButtonEmphasises.low} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis={LxButtonEmphasises.low}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        {/* Theme dark (s) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <LxButton size={Sizes.s} theme={Themes.dark}>
                Default
            </LxButton>

            <LxButton size={Sizes.s} theme={Themes.dark} disabled={true}>
                Disabled
            </LxButton>

            <LxButton size={Sizes.s} theme={Themes.dark}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton size={Sizes.s} theme={Themes.dark}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton size={Sizes.s} theme={Themes.dark}>
                    Split
                </LxButton>

                <LxIconButton size={Sizes.s} theme={Themes.dark}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton size={Sizes.s} theme={Themes.dark} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton size={Sizes.s} theme={Themes.dark}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <LxButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                Default
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s} disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                    Split
                </LxButton>

                <LxIconButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis={LxButtonEmphasises.medium} size={Sizes.s}>
                <LxIcon icon={mdiCheck} />
            </LxIconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <LxButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                Default
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s} disabled={true}>
                Disabled
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                <LxIcon icon={mdiPencil} />
                <span>With Icon</span>
            </LxButton>

            <LxButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                <span>Dropdown</span>
                <LxIcon icon={mdiMenuDown} />
            </LxButton>

            <LxButtonGroup>
                <LxButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                    Split
                </LxButton>

                <LxIconButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>

            <LxButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s} variant={LxButtonVariants.icon}>
                <LxIcon icon={mdiPlus} />
            </LxButton>

            <LxIconButton color="light" emphasis={LxButtonEmphasises.low} size={Sizes.s}>
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
