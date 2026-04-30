import React from 'react';
import { render } from '@testing-library/react';

import timePickerFieldTests from '@lumx/core/js/components/TimePickerField/Tests';
import { commonTestsSuiteRTL, type SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName, getByTagName } from '@lumx/react/testing/utils/queries';
import { TextField } from '@lumx/react';

import { TimePickerField, type TimePickerFieldProps } from './TimePickerField';

/**
 * Render a TimePickerField template with controlled state management.
 * Manages a `value` state and wires it through the `onChange` prop.
 */
function renderWithState(template: (props: any) => React.JSX.Element, initialArgs: Record<string, any> = {}) {
    const Wrapper = () => {
        const [value, setValue] = React.useState<Date | undefined>(initialArgs.value ?? undefined);
        const props = {
            ...initialArgs,
            value,
            onChange: (v: Date | undefined, name?: string, event?: React.SyntheticEvent) => {
                setValue(v);
                initialArgs.onChange?.(v, name, event);
            },
        };
        return template(props);
    };
    return render(<Wrapper />);
}

interface SetupOverrides extends Partial<TimePickerFieldProps> {}

function setup(propsOverride: SetupOverrides = {}, { wrapper }: SetupRenderOptions = {}) {
    const props: TimePickerFieldProps = {
        label: 'Start time',
        locale: 'en-US',
        translations: { clearLabel: 'Clear' },
        onChange: () => undefined,
        value: undefined,
        ...propsOverride,
    };
    const result = render(<TimePickerField {...props} />, { wrapper });

    const textField = getByClassName(document.body, TextField.className as string);
    const inputNative = getByTagName(textField, 'input');

    return { props, textField, inputNative, ...result };
}

describe(`<${TimePickerField.displayName}>`, () => {
    // Run the core test suite — same interaction tests, framework-injected.
    timePickerFieldTests({
        components: { TimePickerField },
        renderWithState,
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: TextField.className as string,
        forwardClassName: 'textField',
        applyTheme: {
            affects: [{ element: 'textField' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
