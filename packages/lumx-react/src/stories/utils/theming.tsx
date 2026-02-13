import React from 'react';
import { Predicate } from '@lumx/react/utils/type';
import { FlexBox } from '@lumx/react';

type Property = string | { value: string };
interface PropertyTree {
    [key: string]: PropertyTree | Property;
}
type Entry = [key: string, value: string];
type Variables = Record<string, string>;

function asValue(prop?: PropertyTree | Property): string | undefined {
    if (typeof prop === 'string') {
        return prop;
    }
    if (typeof prop === 'object' && 'value' in prop) {
        return prop.value as string;
    }
    return undefined;
}

/** Convert property tree into a list of args entries ([key, value]) */
function* toArgEntries(props: PropertyTree | Property, parent = ''): Iterable<Entry> {
    const value = asValue(props);
    if (value) {
        yield [parent, value];
    } else {
        for (const [key, prop] of Object.entries(props)) {
            const newParent = parent ? `${parent}-${key}` : key;
            yield* toArgEntries(prop, newParent);
        }
    }
}
function* parseVariableEntries(cssString: string, strict = false) {
    for (const line of cssString.split(/(?<=;)/)) {
        if (!line.trim()) continue;
        const match = line.match(/^\s*(--lumx[^:]+)\s*:\s*([^;]+);/m);
        if (!match) {
            if (strict) throw new Error(`Could not parse \`${line}\``);
            else continue;
        }
        const [, variableName, variableValue] = match;
        yield [variableName, variableValue];
    }
}

function VariableEditor({
    variable: [key, value],
    setVariable,
    defaultStyle,
}: {
    variable: Entry;
    setVariable: (newVariable: Entry) => void;
    defaultStyle: Variables;
}) {
    const onChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (evt) => {
            setVariable([evt.target.name, evt.target.value]);
        },
        [setVariable],
    );

    return (
        <FlexBox
            as="label"
            orientation="horizontal"
            hAlign="center"
            style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}
        >
            <span style={{ flexShrink: 0 }}>{key}</span>:
            <input
                name={key}
                onChange={onChange}
                style={{ border: 0, padding: 8, fieldSizing: 'content', display: 'inline' } as any}
                value={defaultStyle[key] === value ? '' : value}
                placeholder={value}
            />
            ;
        </FlexBox>
    );
}

function VariablesEditor({
    style,
    defaultStyle,
    setStyle,
}: {
    style: Variables;
    defaultStyle: Variables;
    setStyle: (fn: (newStyle: Variables) => Variables) => void;
}) {
    const setVariable = React.useCallback(
        ([key, value]: Entry) => {
            setStyle((prevStyle) => ({ ...prevStyle, [key]: value }));
        },
        [setStyle],
    );
    return (
        <details className="lumx-spacing-margin-vertical-huge">
            <summary className="lumx-typography-subtitle2">Edit variables</summary>
            {Object.entries(style).map((variable) => (
                <VariableEditor
                    key={variable[0]}
                    defaultStyle={defaultStyle}
                    variable={variable}
                    setVariable={setVariable}
                />
            ))}
        </details>
    );
}

const FILTER_PROPS = ['theme', 'emphasis', 'size'];

export function withTheming<P extends PropertyTree>({
    properties,
    values,
}: {
    properties?: P;
    values?: string | Partial<P>;
}) {
    const initialStyle = values
        ? Object.fromEntries(
              typeof values === 'string'
                  ? parseVariableEntries(values)
                  : toArgEntries(values as PropertyTree, '--lumx'),
          )
        : [];
    const defaultStyle = Object.fromEntries(properties ? Array.from(toArgEntries(properties, '--lumx')) : []);

    const varNames = new Set(Object.keys(initialStyle).concat(Object.keys(defaultStyle)));

    function filteredStyles(args: any) {
        // Create predicate
        const filterArgs = Object.entries(args)
            .map(([argName, argValue]) => {
                if (typeof argValue === 'string' && FILTER_PROPS.includes(argName)) {
                    return (varName: string) =>
                        // Has the given arg with value
                        varName.match(new RegExp(`${argName}-${argValue}`)) ||
                        (argName === 'emphasis' &&
                            (argValue === 'medium' || argValue === 'low') &&
                            varName.match(/emphasis-selected/)) ||
                        // Or does not have the arg at all
                        !varName.match(new RegExp(`${argName}-\\w+`));
                }
                return false;
            })
            .filter(Boolean) as Array<Predicate<string>>;
        const styles = Object.fromEntries(
            Array.from(varNames.values())
                .map((varName) => {
                    if (!filterArgs.every((filter) => filter(varName))) return null as any;
                    return [varName, initialStyle[varName] || defaultStyle[varName]];
                })
                .filter(Boolean),
        );
        return () => styles;
    }

    return (Story: any, ctx: any) => {
        const [style, setStyle] = React.useState<Variables>(filteredStyles(ctx.args));

        return (
            <>
                <Story args={{ ...ctx.args, style: { ...ctx.args.style, ...style } }} />
                <VariablesEditor style={style} defaultStyle={defaultStyle} setStyle={setStyle} />
            </>
        );
    };
}
