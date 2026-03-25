import React from 'react';
import { render } from '@testing-library/react';
import identity from 'lodash/identity';
import over from 'lodash/over';

import comboboxTests from '@lumx/core/js/components/Combobox/Tests';
import { CLASSNAME as TEXT_FIELD_CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { CLASSNAME as COMBOBOX_BUTTON_CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxButton';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { Combobox, IconButton, Button } from '@lumx/react';
import { ComboboxInputProps } from './ComboboxInput';

/**
 * Render a combobox template with controlled state management.
 * Mirrors the withValueOnChange Storybook decorator: manages a `value` state
 * and wires it through the specified change prop.
 *
 * @param template     JSX render function receiving { value, onChange/onSelect, ... }.
 * @param initialArgs  Initial props (value, spies, etc.).
 * @param options      State wiring config (which prop manages state, how to extract value).
 */
function renderWithState(
    template: (props: any) => React.JSX.Element,
    initialArgs: Record<string, any> = {},
    {
        onChangeProp = 'onChange',
        valueExtract = identity,
    }: { onChangeProp?: string; valueExtract?: (v: any) => any } = {},
) {
    const Wrapper = () => {
        const [value, setValue] = React.useState(initialArgs.value ?? '');
        const props = {
            ...initialArgs,
            value,
            [onChangeProp]: over([(v: any) => setValue(valueExtract(v)), initialArgs[onChangeProp]]),
        };
        return template(props);
    };
    return render(<Wrapper />);
}

describe('<Combobox>', () => {
    comboboxTests({
        components: { Combobox, IconButton, Button },
        renderWithState,
    });

    // ── Combobox.Input — commonTestsSuiteRTL ──────────────────────
    describe('<Combobox.Input>', () => {
        /**
         * Setup function for commonTestsSuiteRTL.
         * Renders Combobox.Input inside a Provider (required for context)
         * and returns named DOM references.
         */
        const setup = (propsOverride: Partial<ComboboxInputProps> = {}, options?: SetupRenderOptions) => {
            const props: any = {
                placeholder: 'Pick a fruit…',
                onChange: vi.fn(),
                ...propsOverride,
            };
            const { container } = render(
                <Combobox.Provider>
                    <Combobox.Input {...props} />
                </Combobox.Provider>,
                options,
            );

            const element = getByClassName(container, TEXT_FIELD_CLASSNAME);
            const inputNative = container.querySelector('input') as HTMLInputElement;

            return {
                props,
                container,
                element,
                inputNative,
            };
        };

        commonTestsSuiteRTL(setup, {
            baseClassName: TEXT_FIELD_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'inputNative',
            forwardRef: 'element',
            applyTheme: {
                affects: [{ element: 'element' }],
                viaProp: true,
                viaContext: true,
                defaultTheme: 'light',
            },
        });
    });

    // ── Combobox.Button — commonTestsSuiteRTL ─────────────────────
    describe('<Combobox.Button>', () => {
        /**
         * Setup function for commonTestsSuiteRTL.
         * Renders Combobox.Button inside a Provider (required for context)
         * and returns named DOM references.
         */
        const setup = (propsOverride: Record<string, any> = {}, options?: SetupRenderOptions) => {
            const props: any = {
                label: 'Select a fruit',
                onSelect: vi.fn(),
                ...propsOverride,
            };
            const { container } = render(
                <Combobox.Provider>
                    <Combobox.Button {...props} />
                </Combobox.Provider>,
                options,
            );

            const element = getByClassName(document.body, COMBOBOX_BUTTON_CLASSNAME);

            return {
                props,
                container,
                element,
            };
        };

        commonTestsSuiteRTL(setup, {
            baseClassName: COMBOBOX_BUTTON_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
            forwardRef: 'element',
            applyTheme: {
                affects: [{ element: 'element' }],
                viaProp: true,
                viaContext: true,
                defaultTheme: 'light',
            },
        });
    });
});
