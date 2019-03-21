import React, { Fragment } from 'react';

import {
    Button,
    ButtonEmphasises,
    ButtonGroup,
    ButtonVariants,
    DropdownButton,
    Icon,
    IconButton,
    Sizes,
    Themes,
} from 'LumX';
import { CSS_PREFIX } from 'LumX/core/constants';

import { mdiCheck, mdiMenuDown, mdiPencil, mdiPlus } from 'LumX/icons';

/////////////////////////////

/**
 * The <IconButton> demo component.
 * This component will display a demo of all possible configuration of the <IconButton>.
 */
const ButtonDemo: () => JSX.Element = (): JSX.Element => (
    <Fragment>
        {/* Theme light (m) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <Button>Default</Button>

            <Button disabled={true}>Disabled</Button>

            <Button>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button>
                <span>Handmade dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <DropdownButton dropdown={<span>This is a dropdown</span>}>Dropdown button</DropdownButton>

            <ButtonGroup>
                <Button>handmade splitted dropdown</Button>
                <IconButton>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <DropdownButton isSplitted={true} dropdown={<span>This is a dropdown</span>}>
                Splitted dropdown button
            </DropdownButton>

            <Button variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <Button emphasis={ButtonEmphasises.medium}>Default</Button>

            <Button emphasis={ButtonEmphasises.medium} disabled={true}>
                Disabled
            </Button>

            <Button emphasis={ButtonEmphasises.medium}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button emphasis={ButtonEmphasises.medium}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button emphasis={ButtonEmphasises.medium}>Split</Button>

                <IconButton emphasis={ButtonEmphasises.medium}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button emphasis={ButtonEmphasises.medium} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton emphasis={ButtonEmphasises.medium}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <Button emphasis={ButtonEmphasises.low}>Default</Button>

            <Button emphasis={ButtonEmphasises.low} disabled={true}>
                Disabled
            </Button>

            <Button emphasis={ButtonEmphasises.low}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button emphasis={ButtonEmphasises.low}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button emphasis={ButtonEmphasises.low}>Split</Button>

                <IconButton emphasis={ButtonEmphasises.low}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button emphasis={ButtonEmphasises.low} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton emphasis={ButtonEmphasises.low}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <Button size={Sizes.s}>Default</Button>

            <Button size={Sizes.s} disabled={true}>
                Disabled
            </Button>

            <Button size={Sizes.s}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button size={Sizes.s}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button size={Sizes.s}>Split</Button>

                <IconButton size={Sizes.s}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button size={Sizes.s} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton size={Sizes.s}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        {/* Theme light (s) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <Button emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                Default
            </Button>

            <Button emphasis={ButtonEmphasises.medium} size={Sizes.s} disabled={true}>
                Disabled
            </Button>

            <Button emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                    Split
                </Button>

                <IconButton emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button emphasis={ButtonEmphasises.medium} size={Sizes.s} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-L6`}>
            <Button emphasis={ButtonEmphasises.low} size={Sizes.s}>
                Default
            </Button>

            <Button emphasis={ButtonEmphasises.low} size={Sizes.s} disabled={true}>
                Disabled
            </Button>

            <Button emphasis={ButtonEmphasises.low} size={Sizes.s}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button emphasis={ButtonEmphasises.low} size={Sizes.s}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button emphasis={ButtonEmphasises.low} size={Sizes.s}>
                    Split
                </Button>

                <IconButton emphasis={ButtonEmphasises.low} size={Sizes.s}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button emphasis={ButtonEmphasises.low} size={Sizes.s} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton emphasis={ButtonEmphasises.low} size={Sizes.s}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        {/* Theme dark (m) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <Button theme={Themes.dark}>Default</Button>

            <Button theme={Themes.dark} disabled={true}>
                Disabled
            </Button>

            <Button theme={Themes.dark}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button theme={Themes.dark}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button theme={Themes.dark}>Split</Button>

                <IconButton theme={Themes.dark}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button theme={Themes.dark} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton theme={Themes.dark}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <Button color="light" emphasis={ButtonEmphasises.medium}>
                Default
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.medium} disabled={true}>
                Disabled
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.medium}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.medium}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button color="light" emphasis={ButtonEmphasises.medium}>
                    Split
                </Button>

                <IconButton color="light" emphasis={ButtonEmphasises.medium}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button color="light" emphasis={ButtonEmphasises.medium} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton color="light" emphasis={ButtonEmphasises.medium}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <Button color="light" emphasis={ButtonEmphasises.low}>
                Default
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.low} disabled={true}>
                Disabled
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.low}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.low}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button color="light" emphasis={ButtonEmphasises.low}>
                    Split
                </Button>

                <IconButton color="light" emphasis={ButtonEmphasises.low}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button color="light" emphasis={ButtonEmphasises.low} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton color="light" emphasis={ButtonEmphasises.low}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        {/* Theme dark (s) */}
        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <Button size={Sizes.s} theme={Themes.dark}>
                Default
            </Button>

            <Button size={Sizes.s} theme={Themes.dark} disabled={true}>
                Disabled
            </Button>

            <Button size={Sizes.s} theme={Themes.dark}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button size={Sizes.s} theme={Themes.dark}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button size={Sizes.s} theme={Themes.dark}>
                    Split
                </Button>

                <IconButton size={Sizes.s} theme={Themes.dark}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button size={Sizes.s} theme={Themes.dark} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton size={Sizes.s} theme={Themes.dark}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <Button color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                Default
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s} disabled={true}>
                Disabled
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                    Split
                </Button>

                <IconButton color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton color="light" emphasis={ButtonEmphasises.medium} size={Sizes.s}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>

        <div className={`p++ ${CSS_PREFIX}-theme-background-dark-N`}>
            <Button color="light" emphasis={ButtonEmphasises.low} size={Sizes.s}>
                Default
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.low} size={Sizes.s} disabled={true}>
                Disabled
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.low} size={Sizes.s}>
                <Icon icon={mdiPencil} />
                <span>With Icon</span>
            </Button>

            <Button color="light" emphasis={ButtonEmphasises.low} size={Sizes.s}>
                <span>Dropdown</span>
                <Icon icon={mdiMenuDown} />
            </Button>

            <ButtonGroup>
                <Button color="light" emphasis={ButtonEmphasises.low} size={Sizes.s}>
                    Split
                </Button>

                <IconButton color="light" emphasis={ButtonEmphasises.low} size={Sizes.s}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>

            <Button color="light" emphasis={ButtonEmphasises.low} size={Sizes.s} variant={ButtonVariants.icon}>
                <Icon icon={mdiPlus} />
            </Button>

            <IconButton color="light" emphasis={ButtonEmphasises.low} size={Sizes.s}>
                <Icon icon={mdiCheck} />
            </IconButton>
        </div>
    </Fragment>
);

/////////////////////////////

/*
 * Important Note: for the dynamic loading of the demo component in the Main component, you have to assign your
 * component as the default export of the module.
 */
export default ButtonDemo;
