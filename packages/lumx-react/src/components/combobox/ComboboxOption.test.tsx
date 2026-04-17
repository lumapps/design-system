import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxOption';
import comboboxOptionTests from '@lumx/core/js/components/Combobox/ComboboxOptionTests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { Combobox } from '@lumx/react';
import { ComboboxOptionProps } from './ComboboxOption';

/**
 * Mount a `<Combobox.Option>` inside the minimum required context
 * (`Provider` + `List`) so that registration and click handling work.
 */
function renderOption(propsOverride: Partial<ComboboxOptionProps> = {}, options?: SetupRenderOptions) {
    const props: any = {
        value: 'apple',
        children: 'Apple',
        ...propsOverride,
    };
    const { container } = render(
        <Combobox.Provider>
            <Combobox.List aria-label="Fruits">
                <Combobox.Option {...props} />
            </Combobox.List>
        </Combobox.Provider>,
        options,
    );
    const element = getByClassName(container, CLASSNAME);
    const option = container.querySelector<HTMLElement>('[role="option"]')!;
    return { props, container, element, option };
}

describe('<Combobox.Option>', () => {
    commonTestsSuiteRTL(renderOption, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });

    comboboxOptionTests({
        Combobox,
        render: (template) => render(template()),
    });

    it('should call the onClick listener when the option is clicked', async () => {
        const onClick = vi.fn();
        const { option } = renderOption({ onClick });
        await userEvent.click(option);

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call the onClick listener when activated with the keyboard (Enter on the underlying button)', async () => {
        const onClick = vi.fn();
        const { option } = renderOption({ onClick });
        // The option's action element is a real <button>; pressing Enter on a focused
        // button fires a click event natively.
        option.focus();
        await userEvent.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalled();
    });

    it('should render the action as an anchor when actionProps includes as="a" and href', () => {
        const { container } = render(
            <Combobox.Provider>
                <Combobox.List aria-label="Fruits">
                    <Combobox.Option value="apple" actionProps={{ as: 'a', href: '/apple' }}>
                        Apple
                    </Combobox.Option>
                </Combobox.List>
            </Combobox.Provider>,
        );
        const anchor = container.querySelector('a[href="/apple"]');
        expect(anchor).toBeInTheDocument();
        expect(anchor).toHaveAttribute('role', 'option');
    });
});
