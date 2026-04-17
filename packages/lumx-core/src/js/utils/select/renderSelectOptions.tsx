import { getWithSelector, groupBySelector } from '../selectors';
import type { JSXElement } from '../../types';
import type { BaseSelectComponents, RenderSelectOptionsProps } from './types';

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
        const id = getWithSelector(getOptionId || getOptionName, item);
        const name = getWithSelector(getOptionName || getOptionId, item);
        const description = getOptionDescription && getWithSelector(getOptionDescription, item);
        const isSelected = selectedIds?.has(id) ?? false;

        // Delegate to the consumer's render function when provided.
        // The consumer receives core-computed context and is responsible for rendering
        // a <Combobox.Option> with those values forwarded.
        if (renderOption) {
            return renderOption(item, { index, value: id, isSelected, description }) as any;
        }

        return (
            <Combobox.Option key={id} value={id} description={description} isSelected={isSelected}>
                {name}
            </Combobox.Option>
        );
    }) as any;
}
