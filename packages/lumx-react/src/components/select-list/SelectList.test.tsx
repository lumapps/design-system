import React from 'react';
import { render, screen } from '@testing-library/react';

import selectListTests from '@lumx/core/js/components/SelectList/Tests';
import { CLASSNAME } from '@lumx/core/js/components/SelectList';
import { CLASSNAME as DIVIDER_CLASSNAME } from '@lumx/core/js/components/List/ListDivider';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { SelectList, type SingleSelectListProps } from '.';

/**
 * Render a SelectList template with controlled state management.
 * Manages a `value` state and wires it through the `onChange` prop.
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

describe(`<${SelectList.displayName}>`, () => {
    selectListTests({
        components: { SelectList, Option: SelectList.Option, OptionMoreInfo: SelectList.OptionMoreInfo },
        renderWithState,
    });

    describe('Divider', () => {
        it('should render a decorative list divider', () => {
            render(
                <ul role="listbox" aria-label="Fruits">
                    <SelectList.Divider data-testid="divider" />
                </ul>,
            );
            const divider = screen.getByTestId('divider');
            expect(divider).toHaveClass(DIVIDER_CLASSNAME);
            expect(divider).toHaveAttribute('role', 'none');
        });
    });

    const setup = (
        props: Partial<Omit<SingleSelectListProps<string>, 'aria-label' | 'aria-labelledby'>> = {},
        options?: SetupRenderOptions,
    ) => {
        const { container } = render(
            <SelectList aria-label="Fruits" options={['Apple']} getOptionId={String} {...props} />,
            options,
        );
        return { props, container, element: getByClassName(container, CLASSNAME) };
    };

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
