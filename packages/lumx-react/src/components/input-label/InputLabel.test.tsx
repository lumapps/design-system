import React from 'react';

import { Theme } from '@lumx/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { InputLabel, InputLabelProps } from './InputLabel';

const CLASSNAME = InputLabel.className as string;

type SetupProps = Partial<InputLabelProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: any = { htmlFor: 'id', ...propsOverride };
    render(<InputLabel {...props} />);
    const label = getByClassName(document.body, CLASSNAME);

    return { label, props };
};

describe(`<${InputLabel.displayName}>`, () => {
    describe('Props', () => {
        it('should render text', () => {
            const { label, props } = setup({
                children: 'Some label text',
                htmlFor: '123',
            });
            expect(label).toHaveTextContent(props.children);
            expect(label).toHaveAttribute('for', props.htmlFor);
        });

        it('should render dark theme & required', () => {
            const { label } = setup({ children: 'The label', theme: Theme.dark, isRequired: true });
            expect(label).toHaveClass(CLASSNAME);
            expect(label).toHaveClass(`${CLASSNAME}--theme-dark`);
            expect(label).toHaveClass(`${CLASSNAME}--is-required`);
        });
    });

    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'label', forwardAttributes: 'label' });
});
