import React, { Fragment } from 'react';

import { ShallowWrapper, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';

import { Button, Icon, IconButton } from 'LumX';
import { ICommonSetup } from 'LumX/core/testing/utils.test';
import { mdiPlus } from 'LumX/icons';

import { ButtonGroup, ButtonGroupProps, CLASSNAME } from './ButtonGroup';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<ButtonGroupProps>;

/**
 * Defines what is returned by the setup function.
 */
interface ISetup extends ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: ISetupProps;

    /**
     * The <div> element that is used as a wrapper for the buttons inside of the <ButtonGroup>.
     */
    group: ShallowWrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {ISetupProps} props The props to use to override the default props of the component.
 * @return {ISetup}            An object with the props, the component wrapper and some shortcut to some element inside of
 *                             the component.
 */
const setup: (props?: ISetupProps) => ISetup = ({ ...propsOverrides }: ISetupProps = {}): ISetup => {
    const props: ButtonGroupProps = {
        children: (
            <Fragment>
                <Button>Label</Button>
                <IconButton>
                    <Icon icon={mdiPlus} />
                </IconButton>
            </Fragment>
        ),
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<ButtonGroup {...props} />);

    return {
        group: wrapper.find(`.${CLASSNAME}`),

        props,
        wrapper,
    };
};

describe(`<${ButtonGroup.displayName}>`, () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly a group button', (): void => {
            const { group, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(group).toExist();
            expect(group).toHaveClassName(CLASSNAME);

            expect(group.children().length).toEqual(2);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should forward any CSS class', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            const { group }: ISetup = setup(modifiedProps);

            expect(group).toHaveClassName(CLASSNAME);
            expect(group).toHaveClassName(modifiedProps.className);
        });

        it('should forward any props', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { group }: ISetup = setup(modifiedProps);

            expect(group).toHaveProp(testedProp, modifiedProps[testedProp]);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        beforeEach(
            (): void => {
                try {
                    // If `console.warn` has been mocked at least one, this exists. So disable TS here.
                    // @ts-ignore
                    global.console.warn.mockRestore();
                } catch (exception) {
                    // Nothing to do here.
                }
            },
        );

        it('should fail when no child is given', (): void => {
            expect(
                (): void => {
                    // tslint:disable-next-line: no-null-keyword
                    setup({ children: null });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when less than 2 children are given', (): void => {
            const children: React.ReactNode = <Button>Label</Button>;

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than <${Button.displayName}>s or <${
            IconButton.displayName
        }> is passed as children`, (): void => {
            mockConsole('debug');

            let children: React.ReactNode = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    <Icon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <span>Label</span>
                    <Icon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <span>Label</span>
                    <span>Label 2</span>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <Button>Label</Button>
                    <Icon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <Button>Label</Button>
                    <span>Label</span>>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    <Button>Label</Button>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <span>Label</span>><Button>Label</Button>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when more than 2 children are given', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <Button>Label</Button>
                    <Button>Label 2</Button>
                    <Button>Label 3</Button>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
