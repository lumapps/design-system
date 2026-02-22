import React from 'react';
import { render } from '@testing-library/react';

import selectButtonTests from '@lumx/core/js/components/SelectButton/Tests';
import { SelectButton } from '.';
import { Combobox } from '../combobox';

/**
 * Render a SelectButton template with controlled state management.
 * Manages a `value` state and wires it through the `onChange` prop.
 *
 * @param template    JSX render function receiving `{ value, onChange, ... }`.
 * @param initialArgs Initial props (value, spies, etc.).
 */
function renderWithState(template: (props: any) => React.JSX.Element, initialArgs: Record<string, any> = {}) {
    const Wrapper = () => {
        const [value, setValue] = React.useState(initialArgs.value ?? undefined);
        const props = {
            ...initialArgs,
            value,
            onChange: (v: any) => {
                setValue(v);
                initialArgs.onChange?.(v);
            },
        };
        return template(props);
    };
    return render(<Wrapper />);
}

describe('<SelectButton>', () => {
    selectButtonTests({
        components: { SelectButton, Combobox },
        renderWithState,
    });
});
