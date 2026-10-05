import { ReactNode, useEffect } from 'react';

import { GenericProps } from '@lumx/core/js/types';
import {
    ListboxOptionSkeleton as UI,
    ListboxOptionSkeletonProps as UIProps,
    ListboxOptionSkeletonPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxOptionSkeleton';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useListboxContext } from './context/ListboxContext';

/**
 * Props for Combobox.OptionSkeleton component.
 */
export interface ListboxOptionSkeletonProps
    extends GenericProps,
        ReactToJSX<UIProps, ListboxOptionSkeletonPropsToOverride> {
    /** Content rendered before the skeleton text (e.g. SkeletonCircle for avatar placeholders). */
    before?: ReactNode;
    /** Content rendered after the skeleton text. */
    after?: ReactNode;
    /** Override the default SkeletonTypography content entirely. */
    children?: ReactNode;
}

/**
 * Combobox.OptionSkeleton component — renders skeleton placeholder(s) inside a combobox list.
 *
 * Registers once with the combobox handle on mount (regardless of `count`). The handle
 * fires `loadingChange` / `loadingAnnouncement` events, so consumers don't need an
 * explicit `isLoading` prop on `Combobox.List`.
 *
 * Width variation across skeletons is handled by SCSS `:nth-child` rules automatically.
 *
 * @example
 * ```tsx
 * // Basic — 3 plain skeletons
 * <Combobox.List aria-label="Users">
 *     {users.map(u => <Combobox.Option key={u.id} value={u.id}>{u.name}</Combobox.Option>)}
 *     {isLoading && <Combobox.OptionSkeleton count={3} />}
 * </Combobox.List>
 *
 * // With avatar placeholder
 * {isLoading && <Combobox.OptionSkeleton count={3} before={<SkeletonCircle size="s" />} />}
 * ```
 *
 * @param props Component props.
 * @return React element(s).
 */
export const ListboxOptionSkeleton = (props: ListboxOptionSkeletonProps) => {
    const { list } = useListboxContext();
    useEffect(() => list?.registerSkeleton(), [list]);

    return <UI {...props} />;
};

ListboxOptionSkeleton.displayName = COMPONENT_NAME;
ListboxOptionSkeleton.className = CLASSNAME;
