import { LxButtonProps } from './LxButton';

/////////////////////////////

import React, { Fragment } from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { LxButton, LxIcon } from 'LumX';
import { ICommonSetup } from 'LumX/core/testing/utils.tests';
import { mdiPlus } from 'LumX/icons';

/////////////////////////////

interface ISetup extends ICommonSetup {
    props: LxButtonProps;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {LxButtonProps} props The props to use to override the default props of the component.
 * @return {ISetup}        An object with the props, the component wrapper and some shortcut to some element inside of
 *                         the component.
 */
const setup = ({ ...propsOverrides }: LxButtonProps): ISetup => {
    const props: LxButtonProps = {
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<LxButton {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${LxButton.displayName}>`, () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots', () => {
        it('should render correctly a text label', () => {
            const children: React.ReactNode = 'Label';

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly a <span> label', () => {
            const children: React.ReactNode = <span>label</span>;

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly an icon and a text label', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    label
                </Fragment>
            );

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly an icon and a <span> label', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <span>label</span>
                </Fragment>
            );

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly a text label and an icon', () => {
            const children: React.ReactNode = (
                <Fragment>
                    label
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly a <span> label and an icon', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <span>label</span>
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly two icons and a text label', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    label
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly two icons and a <span> label', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <span>label</span>
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it("should render correctly an icon button with the 'button' `variant`", () => {
            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            const { wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();
        });

        it("should render correctly an icon button with the 'icon' `variant`", () => {
            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            const { wrapper }: ISetup = setup({ children, variant: 'icon' });
            expect(wrapper).toMatchSnapshot();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.

    /////////////////////////////

    // 3. Test events.

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Condition', () => {
        beforeEach(() => {
            try {
                // If `console.warn` has been mocked at least one, this exists. So disable TS here.
                // @ts-ignore
                global.console.warn.mockClear();
            } catch (exception) {
                // Nothing to do here.
            }
        });

        it(`should fail when no child is given`, () => {
            expect(() => {
                // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                // @ts-ignore
                setup({});
            }).toThrowErrorMatchingSnapshot();
        });

        it("should fail when more than 3 children are given in the 'button' `variant`", () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <span>label</span>
                    <span>label 2</span>
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(() => {
                // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                // @ts-ignore
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than a text, <span> or <${
            LxIcon.displayName
        }> is given as child in the 'button' \`variant\``, () => {
            const children: React.ReactNode = <div>toto</div>;

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it("should fail when more than 1 text or <span> child is given in the 'button' `variant`", () => {
            let children: React.ReactNode = (
                <Fragment>
                    <span>label</span>
                    label 2
                </Fragment>
            );

            expect(() => {
                // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                // @ts-ignore
                setup({ children });
            }).toThrowErrorMatchingSnapshot();

            children = (
                <Fragment>
                    <span>label</span>
                    <span>label 2</span>
                </Fragment>
            );

            expect(() => {
                // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                // @ts-ignore
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when there are 2 or more <${LxIcon.displayName}> in a row in the 'button' \`variant\``, () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(() => {
                // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                // @ts-ignore
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it("should fail when more than 1 child is given in the 'icon' `variant`", () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(() => {
                // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                // @ts-ignore
                setup({ children, variant: 'icon' });
            }).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than a <${
            LxIcon.displayName
        }> is given as child in the 'icon' \`variant\``, () => {
            const children: React.ReactNode = 'Toto';

            expect(() => {
                setup({ children, variant: 'icon' });
            }).toThrowErrorMatchingSnapshot();
        });

        it("should warn the user when rendering an icon button with the 'button' `variant`", () => {
            global.console.warn = jest.fn();

            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            setup({ children });
            expect(global.console.warn).toHaveBeenCalled();
        });

        it("should not warn the user when rendering an icon button with the 'icon' `variant`", () => {
            global.console.warn = jest.fn();

            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            setup({ children, variant: 'icon' });
            expect(global.console.warn).not.toHaveBeenCalled();
        });
    });

    /////////////////////////////

    // 5. Test state.
});
