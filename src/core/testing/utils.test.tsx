import { ShallowWrapper } from 'enzyme';

/////////////////////////////

/**
 * Defines what is always returned by the setup function.
 * Note that `props` should be retyped in the specific interface extending this one.
 */
interface ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: {};

    /**
     * The Enzyme wrapper around of the tested component.
     */
    wrapper: ShallowWrapper;
}

/////////////////////////////

export { ICommonSetup };
