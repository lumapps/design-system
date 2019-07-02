import { ReactWrapper, ShallowWrapper } from 'enzyme';

import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import { IGenericProps } from 'LumX/react/utils';

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
interface ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: IGenericProps;

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
    setup: (props?: IGenericProps, shallowRendering?: boolean) => ICommonSetup,
    { ...tests }: { className?: string | string[]; prop?: string | string[] },
    { ...params }: IGenericProps,
): void {
    if (isEmpty(tests)) {
        return;
    }

    describe('Common tests suite', (): void => {
        if (tests.className !== undefined && !isEmpty(tests.className)) {
            it('should forward any CSS class', (): void => {
                const modifiedProps: IGenericProps = {
                    className: 'component component--is-tested',
                };

                const wrappers: ICommonSetup = setup(modifiedProps);

                const wrappersToTest: string[] = isArray(tests.className)
                    ? tests.className!
                    : [tests.className!, tests.className!];
                expect(wrappers[wrappersToTest[0]]).toHaveClassName(params.className);
                expect(wrappers[wrappersToTest[1]]).toHaveClassName(modifiedProps.className);
            });
        }

        // tslint:disable-next-line: early-exit
        if (tests.prop !== undefined && !isEmpty(tests.prop)) {
            it('should forward any other prop', (): void => {
                const testedProp: string = params.prop || 'winter';
                const modifiedProps: IGenericProps = {
                    [testedProp]: params.propValue || 'is coming',
                };

                const wrappers: ICommonSetup = setup(modifiedProps);

                const wrappersToTest: string[] = isArray(tests.prop) ? tests.prop! : [tests.prop!];
                wrappersToTest.forEach(
                    (wrapper: string): void => {
                        expect(wrappers[wrapper]).toHaveProp(testedProp, modifiedProps[testedProp]);
                    },
                );
            });
        }
    });
}

/////////////////////////////

export { ICommonSetup, Wrapper, commonTestsSuite };
