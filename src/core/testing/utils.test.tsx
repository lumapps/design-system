import { ReactWrapper, ShallowWrapper } from 'enzyme';

import { IGenericProps } from 'LumX/react/utils';

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

export { ICommonSetup, Wrapper };
