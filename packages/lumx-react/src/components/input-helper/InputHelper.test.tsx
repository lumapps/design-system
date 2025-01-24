import React from 'react';

import { Kind, Theme } from '@lumx/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { INPUT_HELPER_CONFIGURATION } from '@lumx/react/components/input-helper/constants';
import { InputHelper, InputHelperProps } from './InputHelper';

const CLASSNAME = InputHelper.className as string;

type SetupProps = Partial<InputHelperProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<InputHelper {...props} />, { wrapper });
    const helper = getByClassName(document.body, CLASSNAME);

    return { helper, props };
};

describe(`<${InputHelper.displayName}>`, () => {
    describe('Props', () => {
        it('should render text', () => {
            const { props, helper } = setup({ children: 'helper text' });

            expect(helper).toHaveTextContent(props.children);
            expect(helper.className).toMatchInlineSnapshot('"lumx-input-helper lumx-input-helper--theme-light"');
        });

        it('should render dark theme', () => {
            const { helper } = setup({ theme: Theme.dark });
            expect(helper).toHaveClass('lumx-input-helper--theme-dark');
        });

        it.each(Object.values(Kind))('should render kind %s', (kind) => {
            const { helper } = setup({ kind });
            const { color } = INPUT_HELPER_CONFIGURATION[kind as any] || {};
            if (color) expect(helper).toHaveClass(`${CLASSNAME}--color-${color}`);
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'helper',
        forwardAttributes: 'helper',
        applyTheme: {
            affects: [{ element: 'helper' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
