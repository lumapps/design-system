import { defineComponent } from 'vue';
import { render, fireEvent } from '@testing-library/vue';
import { vi } from 'vitest';

import { getByClassName } from '@lumx/core/testing/queries';
import { CLASSNAME as CHIP_CLASSNAME } from '@lumx/core/js/components/Chip';

import Chip from '../components/chip/Chip';
import MenuButton from '../components/menu-button/MenuButton';
import MenuItem from '../components/menu-button/MenuItem';
import ComboboxProvider from '../components/combobox/ComboboxProvider';
import ComboboxInput from '../components/combobox/ComboboxInput';
import ListboxList from '../components/listbox/ListboxList';
import ListboxOption from '../components/listbox/ListboxOption';

/**
 * Proves the compat contract with no `configureCompat` call: a LumX component (flagged via
 * `COMPAT_OPTIONS`) renders correctly, and its `@lumx/core` children (flagged via the
 * `__lumxCreateVNode` pragma) are never read as Vue 2 async component factories.
 */
describe('@vue/compat', () => {
    it('renders a Chip label, class and after slot', () => {
        const { getByText } = render(Chip, {
            props: { class: 'extra-class' },
            slots: { default: () => 'Label', after: () => 'After' },
        });

        expect(getByText('Label')).toBeInTheDocument();
        expect(getByText('After')).toBeInTheDocument();
        const chip = getByClassName(document.body, CHIP_CLASSNAME);
        expect(chip.className.split(' ')).toContain('extra-class');
    });

    it('emits click on Chip', async () => {
        const onClick = vi.fn();
        const { getByText } = render(Chip, { props: { onClick }, slots: { default: () => 'Label' } });
        await fireEvent.click(getByText('Label'));
        expect(onClick).toHaveBeenCalled();
    });

    it('forwards $attrs class from a mode-2 app wrapper to the Chip root once', () => {
        const Wrapper = defineComponent({
            setup: () =>
                () => <Chip class="wrapper-class">Label</Chip>,
        });
        const { getByText } = render(Wrapper);
        const chip = getByText('Label').closest(`.${CHIP_CLASSNAME}`) as HTMLElement;
        expect(chip.className.split(' ').filter((token) => token === 'wrapper-class')).toHaveLength(1);
    });

    it('opens the MenuButton menu on a click', async () => {
        const { getByRole } = render(
            defineComponent({
                setup: () => () => (
                    <MenuButton label="Menu">
                        <MenuItem>Option</MenuItem>
                    </MenuButton>
                ),
            }),
        );

        const trigger = getByRole('button');
        await expect(fireEvent.click(trigger)).resolves.not.toThrow();
    });

    it('renders ListboxOption content', async () => {
        const { getByText, findByRole } = render(
            defineComponent({
                setup: () => () => (
                    <ComboboxProvider>
                        <ComboboxInput placeholder="Pick" onChange={() => {}} />
                        <ListboxList>
                            <ListboxOption value="apple">Apple</ListboxOption>
                        </ListboxList>
                    </ComboboxProvider>
                ),
            }),
        );

        await fireEvent.click(await findByRole('combobox'));
        expect(getByText('Apple')).toBeInTheDocument();
    });
});
