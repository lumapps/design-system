import { render } from '@testing-library/react';

import comboboxTests from '@lumx/core/js/components/Combobox/Tests';
import { CLASSNAME as TEXT_FIELD_CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { CLASSNAME as COMBOBOX_BUTTON_CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxButton';
import { commonTestsSuiteRTL, renderWithState, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { Combobox, IconButton, Button } from '@lumx/react';
import { ComboboxInputProps } from './ComboboxInput';

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

        it('should render beforeElement in the input', () => {
            const { element } = setup({ beforeElement: <span>Before</span> });
            expect(getByClassName(element, `${TEXT_FIELD_CLASSNAME}__before-element`)).toHaveTextContent('Before');
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
