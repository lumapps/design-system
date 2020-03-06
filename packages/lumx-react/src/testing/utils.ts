import { ReactWrapper, ShallowWrapper } from 'enzyme';
import 'jest-enzyme';

import isEmpty from 'lodash/isEmpty';

import { GenericProps } from '@lumx/react/utils';

/**
 * The type of a wrapper that can be
 */
export type Wrapper = ShallowWrapper | ReactWrapper;

/**
 * Defines what is always returned by the setup function.
 * Note that `props` should be retyped in the specific interface extending this one.
 */
export interface CommonSetup {
    /**
     * The properties of the tested component.
     */
    props: GenericProps;

    /**
     * The Enzyme wrapper around of the tested component.
     */
    wrapper: Wrapper;
}

/**
 * Run the common tests suite: CSS class forwarding, prop forwarding, ...
 *
 * @param setup  The setup function.
 * @param tests  The tests to enable.
 *               The key is the name of the test, the value is the name of the wrapper in the object returned
 *               by the `setup` function.
 * @param params The params that can be used by the tests.
 */
export function commonTestsSuite<S extends CommonSetup>(
    setup: (props?: GenericProps, shallowRendering?: boolean) => S,
    { ...tests }: { className?: keyof S; prop?: keyof S },
    { ...params }: GenericProps,
) {
    if (isEmpty(tests)) {
        return;
    }

    describe('Common tests suite', () => {
        const { className: testClassNameForwarding, prop: testPropForwarding } = tests;
        if (testClassNameForwarding) {
            it('should forward any CSS class', () => {
                const modifiedProps = {
                    className: 'component component--is-tested',
                };
                const wrappers = setup(modifiedProps);
                expect(wrappers[testClassNameForwarding]).toHaveClassName(params.className);
            });
        }

        if (testPropForwarding) {
            it('should forward any other prop', () => {
                const testedProp = params.prop ?? 'winter';
                const modifiedProps = {
                    [testedProp]: params.propValue ?? 'is coming',
                };
                const wrappers = setup(modifiedProps);
                expect(wrappers[testPropForwarding]).toHaveProp(testedProp, modifiedProps[testedProp]);
            });
        }
    });
}
