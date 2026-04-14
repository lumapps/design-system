import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import { CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxOption';
import comboboxOptionTests from '@lumx/core/js/components/Combobox/ComboboxOptionTests';
import { getByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Combobox } from '.';
import ComboboxOption from './ComboboxOption';
import ComboboxProvider from './ComboboxProvider';
import ComboboxList from './ComboboxList';

/**
 * Mount a `<Combobox.Option>` inside the minimum required context
 * (`Provider` + `List`) so that registration and click handling work.
 */
function renderOption(propsOverride: any = {}, options: SetupRenderOptions<any> = {}) {
    const { value = 'apple', ...rest } = propsOverride;
    const result = render(
        {
            setup: () => () => (
                <ComboboxProvider>
                    <ComboboxList aria-label="Fruits">
                        <ComboboxOption value={value} {...rest}>
                            Apple
                        </ComboboxOption>
                    </ComboboxList>
                </ComboboxProvider>
            ),
        },
        options,
    );
    const element = getByClassName(document.body, CLASSNAME);
    const option = document.body.querySelector<HTMLElement>('[role="option"]')!;
    return { ...result, props: propsOverride, element, option };
}

describe('<Combobox.Option>', () => {
    commonTestsSuiteVTL(renderOption, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
    });

    comboboxOptionTests({
        Combobox,
        render: (template) => {
            const { unmount, container } = render({ setup: () => () => template() });
            return { unmount, container: container as HTMLElement };
        },
    });

    it('should call the @click listener when the option is clicked', async () => {
        const onClick = vi.fn();
        const { option } = renderOption({ onClick });
        await userEvent.click(option);

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call the @click listener when activated with the keyboard (Enter on the underlying button)', async () => {
        const onClick = vi.fn();
        const { option } = renderOption({ onClick });
        // The option's action element is a real <button>; pressing Enter on a focused
        // button fires a click event natively.
        option.focus();
        await userEvent.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalled();
    });
});
