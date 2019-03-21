import React, { Fragment } from 'react';

import { shallow, ShallowWrapper } from 'enzyme';
import mockConsole from 'jest-mock-console';

import { LxButton, LxIcon, LxIconButton } from 'LumX';
import { ICommonSetup } from 'LumX/core/testing/utils.test';
import { mdiPlus } from 'LumX/icons';

import { CLASSNAME, LxButtonGroup, LxButtonGroupProps } from './ButtonGroup';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<LxButtonGroupProps>;

/**
 * Defines what is returned by the setup function.
 */
interface ISetup extends ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: ISetupProps;

    /**
     * The <div> element that is used as a wrapper for the buttons inside of the <LxButtonGroup>.
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
const setup = ({ ...propsOverrides }: ISetupProps = {}): ISetup => {
    const props: LxButtonGroupProps = {
        children: (
            <Fragment>
                <LxButton>Label</LxButton>
                <LxIconButton>
                    <LxIcon icon={mdiPlus} />
                </LxIconButton>
            </Fragment>
        ),
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<LxButtonGroup {...props} />);

    return {
        group: wrapper.find(`.${CLASSNAME}`),

        props,
        wrapper,
    };
};

describe(`<${LxButtonGroup.displayName}>`, () => {
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
                    setup({ children: null });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when less than 2 children are given', (): void => {
            const children: React.ReactNode = <LxButton>Label</LxButton>;

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than <${LxButton.displayName}>s or <${
            LxIconButton.displayName
        }> is passed as children`, (): void => {
            mockConsole('debug');

            let children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
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
                    <LxIcon icon={mdiPlus} />
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
                    <LxButton>Label</LxButton>
                    <LxIcon icon={mdiPlus} />
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
                    <LxButton>Label</LxButton>
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
                    <LxIcon icon={mdiPlus} />
                    <LxButton>Label</LxButton>
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
                    <span>Label</span>><LxButton>Label</LxButton>
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
                    <LxButton>Label</LxButton>
                    <LxButton>Label 2</LxButton>
                    <LxButton>Label 3</LxButton>
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
