import { ReactWrapper, ShallowWrapper } from 'enzyme';
import 'jest-enzyme';

import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import { GenericProps } from '@lumx/react/utils';

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The type of a wrapper that can be
 */
type Wrapper = ShallowWrapper | ReactWrapper;

/**
 * Defines what is always returned by the setup function.
 * Note that `props` should be retyped in the specific interface extending this one.
 */
interface CommonSetup {
    /**
     * The properties of the tested component.
     */
    props: GenericProps;

    /**
     * The Enzyme wrapper around of the tested component.
     */
    wrapper: Wrapper;
}

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Run the common tests suite: CSS class forwarding, prop forwarding, ...
 *
 * @param setup  The setup function.
 * @param   tests  The tests to enable.
 *                          The key is the name of the test, the value is the name of the wrapper in the object returned
 *                          by the `setup` function.
 * @param   params The params that can be used by the tests.
 */
function commonTestsSuite(
    setup: (props?: GenericProps, shallowRendering?: boolean) => CommonSetup,
    { ...tests }: { className?: string | string[]; prop?: string | string[] },
    { ...params }: GenericProps,
) {
    if (isEmpty(tests)) {
        return;
    }

    describe('Common tests suite', () => {
        if (tests.className !== undefined && !isEmpty(tests.className)) {
            it('should forward any CSS class', () => {
                const modifiedProps: GenericProps = {
                    className: 'component component--is-tested',
                };

                const wrappers: any = setup(modifiedProps);

                const wrappersToTest = isArray(tests.className)
                    ? tests.className!
                    : [tests.className!, tests.className!];
                expect(wrappers[wrappersToTest[0]]).toHaveClassName(params.className);
                expect(wrappers[wrappersToTest[1]]).toHaveClassName(modifiedProps.className);
            });
        }

        // tslint:disable-next-line: early-exit
        if (tests.prop !== undefined && !isEmpty(tests.prop)) {
            it('should forward any other prop', () => {
                const testedProp: string = params.prop || 'winter';
                const modifiedProps: GenericProps = {
                    [testedProp]: params.propValue || 'is coming',
                };

                const wrappers: any = setup(modifiedProps);

                const wrappersToTest: string[] = isArray(tests.prop) ? tests.prop! : [tests.prop!];
                wrappersToTest.forEach((wrapper: string) => {
                    expect(wrappers[wrapper]).toHaveProp(testedProp, modifiedProps[testedProp]);
                });
            });
        }
    });
}

/////////////////////////////

export { CommonSetup, Wrapper, commonTestsSuite };
