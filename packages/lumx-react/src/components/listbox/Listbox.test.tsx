import listboxTests from '@lumx/core/js/components/Listbox/Tests';
import { renderWithState } from '@lumx/react/testing/utils';
import { Combobox, IconButton } from '@lumx/react';
import { Listbox } from '.';

describe('<Listbox> (internal)', () => {
    listboxTests({ components: { Listbox, Combobox, IconButton }, renderWithState });
});
