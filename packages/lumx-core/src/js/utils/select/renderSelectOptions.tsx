import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckCircle, mdiRadioboxBlank } from '@lumx/icons';

import { Icon } from '../../components/Icon';
import { getWithSelector, groupBySelector } from '../selectors';
import type { JSXElement } from '../../types';
import type { BaseSelectComponents, RenderSelectOptionsProps } from './types';

/**
 * Get the selection state icons of an option. The icon is always rendered after the label.
 *
 * - `single`: a check circle icon when selected, a blank radio icon otherwise.
 * - `multiple`: a checkbox icon, marked or blank.
 *
 * The icon of a selected option uses the primary color.
 *
 * @param selectionType Selection type.
 * @param isSelected    Whether the option is selected.
 * @return `before`/`after` icons (undefined when there is nothing to render).
 */
export function getSelectionIcons(
    selectionType: 'single' | 'multiple' | undefined,
    isSelected: boolean,
): { before?: JSXElement; after?: JSXElement } {
    const color = isSelected ? 'primary' : undefined;
    if (selectionType === 'multiple') {
        return { after: Icon({ icon: isSelected ? mdiCheckboxMarked : mdiCheckboxBlankOutline, color }) as JSXElement };
    } else if (selectionType === 'single') {
        return { after: Icon({ icon: isSelected ? mdiCheckCircle : mdiRadioboxBlank, color }) as JSXElement };
    }
    return {};
}

/**
 * Render options as ComboboxOption elements.
 * Framework-specific components are passed as a second argument.
 */
export function renderSelectOptions<O>(
    props: RenderSelectOptionsProps<O>,
    components: BaseSelectComponents,
): JSXElement {
    const {
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        selected,
        selectionType,
        getSectionId,
        renderSectionTitle,
    } = props;
    const { Combobox } = components;

    // Render sections when getSectionId is provided.
    if (getSectionId && options) {
        const sections = groupBySelector(options, (option) => getWithSelector(getSectionId, option));

        return Array.from(sections.entries()).map(([sectionId, sectionOptions]) => {
            // When renderSectionTitle is provided, use the custom JSX as the label; otherwise fall back to sectionId.
            const sectionLabel = renderSectionTitle ? renderSectionTitle(sectionId, sectionOptions) : sectionId;

            return (
                <Combobox.Section key={sectionId} label={sectionLabel}>
                    {renderSelectOptions(
                        {
                            options: sectionOptions,
                            getOptionId,
                            getOptionName,
                            getOptionDescription,
                            renderOption,
                            selected,
                            selectionType,
                            // getSectionId intentionally omitted to render flat options inside.
                        },
                        components,
                    )}
                </Combobox.Section>
            );
        }) as any;
    }

    // Build a Set of selected IDs (works for both single value and arrays).
    const selectedIds: Set<any> | undefined = selected
        ? new Set((Array.isArray(selected) ? selected : [selected]).map((s) => getWithSelector(getOptionId, s)))
        : undefined;

    return options?.map((item, index) => {
        const id = getWithSelector(getOptionId || getOptionName, item) as string;
        const name = getWithSelector(getOptionName || getOptionId, item) || id;
        const description = getOptionDescription && getWithSelector(getOptionDescription, item);
        const isSelected = selectedIds?.has(id) ?? false;
        const { before, after } = getSelectionIcons(selectionType, isSelected);

        // Delegate to the consumer's render function when provided.
        // The consumer receives core-computed context and is responsible for rendering
        // a <Combobox.Option> with those values forwarded.
        if (renderOption) {
            return renderOption(item, { index, value: id, name, isSelected, description, before, after }) as any;
        }

        return (
            <Combobox.Option
                key={id}
                value={id}
                description={description}
                isSelected={isSelected}
                before={before}
                after={after}
            >
                {name}
            </Combobox.Option>
        );
    }) as any;
}
