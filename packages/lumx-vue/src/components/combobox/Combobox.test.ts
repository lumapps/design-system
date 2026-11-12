import { render } from '@testing-library/vue';
import { defineComponent, h } from 'vue';

import comboboxTests from '@lumx/core/js/components/Combobox/Tests';
import { CLASSNAME as TEXT_FIELD_CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { CLASSNAME as COMBOBOX_BUTTON_CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxButton';
import { getByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, renderWithState, SetupRenderOptions } from '@lumx/vue/testing';

import { Button, IconButton } from '@lumx/vue';

import { Combobox } from '.';
import ComboboxButton from './ComboboxButton';
import ComboboxInput from './ComboboxInput';
import ComboboxProvider from './ComboboxProvider';

describe('<Combobox>', () => {
    comboboxTests({
        components: { Combobox, IconButton, Button },
        renderWithState,
    });

    // ── Combobox.Input — commonTestsSuiteVTL ──────────────────────
    describe('<Combobox.Input>', () => {
        /**
         * Setup function for commonTestsSuiteVTL.
         * Renders Combobox.Input inside a Provider (required for context)
         * and returns named DOM references.
         */
        const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
            const Wrapper = defineComponent({
                setup() {
                    return () =>
                        h(ComboboxProvider, null, {
                            default: () =>
                                h(ComboboxInput, {
                                    placeholder: 'Pick a fruit…',
                                    ...propsOverride,
                                }),
                        });
                },
            });

            render(Wrapper, options);

            const element = getByClassName(document.body, TEXT_FIELD_CLASSNAME);
            const inputNative = document.body.querySelector('input') as HTMLInputElement;

            return {
                props: propsOverride,
                element,
                inputNative,
            };
        };

        commonTestsSuiteVTL(setup, {
            baseClassName: TEXT_FIELD_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'inputNative',
            applyTheme: {
                affects: [{ element: 'element' }],
                viaProp: true,
                viaContext: true,
                defaultTheme: 'light',
            },
        });
    });

    // ── Combobox.Button — commonTestsSuiteVTL ─────────────────────
    describe('<Combobox.Button>', () => {
        /**
         * Setup function for commonTestsSuiteVTL.
         * Renders Combobox.Button inside a Provider (required for context)
         * and returns named DOM references.
         */
        const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
            const Wrapper = defineComponent({
                setup() {
                    return () =>
                        h(ComboboxProvider, null, {
                            default: () =>
                                h(ComboboxButton, {
                                    label: 'Select a fruit',
                                    ...propsOverride,
                                }),
                        });
                },
            });

            render(Wrapper, options);

            const element = getByClassName(document.body, COMBOBOX_BUTTON_CLASSNAME);

            return {
                props: propsOverride,
                element,
            };
        };

        commonTestsSuiteVTL(setup, {
            baseClassName: COMBOBOX_BUTTON_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
            applyTheme: {
                affects: [{ element: 'element' }],
                viaProp: true,
                viaContext: true,
                defaultTheme: 'light',
            },
        });
    });
});
