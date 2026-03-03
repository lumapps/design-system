import type { Entry, Variables } from './themeVariables';

/** Framework-specific components injected by React/Vue decorators */
type NestedComponents = {
    /** FlexBox component for horizontal layout */
    FlexBox: any;
    /** Wrapper for details/summary disclosure widget */
    DetailsContainer: any;
};

/** Parameters for the ThemingVariablesTable component */
type ThemingVariablesTableParams = {
    /** Current CSS variable values */
    style: Variables;
    /** Default CSS variable values (for placeholder display) */
    defaultStyle: Variables;
    /** Callback when a variable is changed */
    onVariableChange: (entry: Entry) => void;
    /** Framework-specific components */
    nestedComponents: NestedComponents;
};

/**
 * Framework-agnostic JSX component for rendering CSS variable editors.
 * Similar to CombinationsTable, but renders a simpler disclosure widget
 * with input fields for editing CSS custom properties.
 *
 * This component receives framework-specific components (FlexBox, DetailsContainer)
 * as dependencies, allowing it to work with both React and Vue.
 */
export function ThemingVariablesTable({
    style,
    defaultStyle,
    onVariableChange,
    nestedComponents,
}: ThemingVariablesTableParams) {
    const { FlexBox, DetailsContainer } = nestedComponents;

    return (
        <DetailsContainer>
            <summary className="lumx-typography-subtitle2">Edit variables</summary>
            {Object.entries(style).map(([key, value]) => (
                <FlexBox
                    key={key}
                    as="label"
                    orientation="horizontal"
                    hAlign="center"
                    style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}
                >
                    <span style={{ flexShrink: 0 }}>{key}</span>:
                    <input
                        name={key}
                        onInput={(evt: any) => onVariableChange([key, evt.target.value])}
                        style={{ border: 0, padding: 8, fieldSizing: 'content', display: 'inline' } as any}
                        value={defaultStyle[key] === value ? '' : value}
                        placeholder={value}
                    />
                    ;
                </FlexBox>
            ))}
        </DetailsContainer>
    );
}
