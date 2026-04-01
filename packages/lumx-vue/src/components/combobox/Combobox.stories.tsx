import { Avatar, IconButton, SkeletonCircle } from '@lumx/vue';
import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/Combobox/Stories';

import { Combobox } from '.';

const { meta, ...stories } = setup({
    components: {
        Combobox,
        IconButton,
        Avatar,
        SkeletonCircle,
    },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/combobox/Combobox',
    ...meta,
};

export const ComboboxWithSubcomponents = { ...stories.ComboboxWithSubcomponents };
export const ComboboxWithSection = { ...stories.ComboboxWithSection };
export const ComboboxWithFilteredSections = { ...stories.ComboboxWithFilteredSections };
export const ComboboxWithButton = { ...stories.ComboboxWithButton };
export const ComboboxWithLinkOptions = { ...stories.ComboboxWithLinkOptions };
export const ComboboxWithOptionMoreInfo = { ...stories.ComboboxWithOptionMoreInfo };
export const GridComboboxWithInput = { ...stories.GridComboboxWithInput };
export const GridComboboxWithButton = { ...stories.GridComboboxWithButton };
export const ComboboxWithEmptyState = { ...stories.ComboboxWithEmptyState };
export const ComboboxWithErrorState = { ...stories.ComboboxWithErrorState };
export const ComboboxWithLoading = { ...stories.ComboboxWithLoading };
export const ComboboxWithLoadMore = { ...stories.ComboboxWithLoadMore };
export const ComboboxWithSectionLoading = { ...stories.ComboboxWithSectionLoading };
export const ComboboxWithAvatarLoading = { ...stories.ComboboxWithAvatarLoading };
