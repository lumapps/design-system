import listboxTests from '@lumx/core/js/components/Listbox/Tests';
import { Combobox, IconButton } from '@lumx/vue';
import { renderWithState } from '@lumx/vue/testing';
import { Listbox } from '.';

describe('<Listbox> (internal)', () => {
    listboxTests({ components: { Listbox, Combobox, IconButton }, renderWithState });
});
