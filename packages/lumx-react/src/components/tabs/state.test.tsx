import { mount } from 'enzyme';
import 'jest-enzyme';
import React from 'react';

import { useTabProviderContext } from './state';

describe('useTabProviderContext', () => {
    it('should throw when used outside a TabProvider', () => {
        let error;
        const Component = () => {
            try {
                useTabProviderContext('tab');
            } catch (e) {
                error = e;
            }
            return null;
        };
        mount(<Component />);
        expect(error).toMatchInlineSnapshot(`
            [Error: No TabProvider context found.
            Please wrap Tab and TabPanel components in a TabProvider.]
        `);
    });
});
