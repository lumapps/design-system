import React, { Fragment, ReactNode, useState } from 'react';
import partition from 'lodash/partition';
import castArray from 'lodash/castArray';
import orderBy from 'lodash/orderBy';
import upperFirst from 'lodash/upperFirst';

import { Alignment, Divider, ExpansionPanel, Flag, Grid, GridItem, Heading, Message, Text } from '@lumx/react';
import { useFramework } from '@lumx/demo/components/layout/FrameworkContext';

import './PropTable.scss';
import { classNames } from '@lumx/core/js/utils';

export interface Property {
    /** Name. */
    name: string;
    /** Required flag. */
    required: boolean;
    /** Deprecated flag. */
    deprecated: boolean;
    /** Description. */
    description: string;
    /** Accepted type or types (union type). */
    type: string | string[];
    /** Default value. */
    defaultValue: string;
    /** Where the property comes from */
    declarations?: Array<{ name: string; fileName: string }>;
    /** Alias prop names (e.g. "disabled" is an alias of "isDisabled"). */
    aliases?: string[];
}

/** A single variant entry in a discriminated-union Props type. */
export interface VariantItem {
    /** The discriminant value (e.g. "button", "chip"). */
    value: string;
    /** Props that are specific to this variant. */
    props: Property[];
    /** Whether this variant is the default (open by default in the UI). */
    isDefault?: boolean;
}

/** Discriminated-union variant metadata emitted by docgen. */
export interface VariantDoc {
    /** The discriminant prop name (e.g. "variant", "selectionType"). */
    discriminant: string;
    /** One entry per union branch. */
    items: VariantItem[];
}

/** A type parameter with its documentation. */
export interface TypeParamDoc {
    /** Type parameter name (e.g. "O", "E", "S"). */
    name: string;
    /** Description from @typeParam JSDoc. */
    description: string;
}

const renderTypeTableRow = ({ type, defaultValue }: Property) => (
    <Text as="span" typography="body1" className="prop-table__type">
        {castArray(type).reduce((acc, typeName, index, arr) => {
            if (typeName === defaultValue) {
                // Display default value in bold.
                acc.push(<strong key={defaultValue}>{defaultValue}</strong>);
            } else {
                acc.push(typeName);
            }

            if (index !== arr.length - 1) {
                // Interleave with pipes.
                acc.push(' | ');
            }
            return acc;
        }, [] as ReactNode[])}
        {defaultValue && !castArray(type).includes(defaultValue) && (
            <span>
                {' '}
                (default: <strong>{defaultValue}</strong>)
            </span>
        )}
    </Text>
);

const Row: React.FC<{ property: Property }> = ({ property }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <ExpansionPanel
            label="Lorem ipsum"
            isOpen={isOpen}
            onToggleOpen={toggleOpen}
            toggleButtonProps={{ label: 'Toggle' }}
            id={`properties-${property.name}`}
        >
            <header>
                <Grid
                    hAlign={Alignment.center}
                    className={property.deprecated ? classNames.font('dark-L2') : undefined}
                >
                    <GridItem width="4">
                        <Text as="span" typography="body1">
                            {property.deprecated && (
                                <>
                                    <Flag label="deprecated" color="yellow" />{' '}
                                </>
                            )}
                            <Text as="span" typography={property.required ? 'subtitle1' : 'body1'}>
                                {property.name}
                                {property.required ? ' *' : null}
                            </Text>
                            {property.aliases?.map((alias) => (
                                <Fragment key={alias}>
                                    {' / '}
                                    {alias}
                                </Fragment>
                            ))}
                        </Text>
                    </GridItem>

                    <GridItem width="8">{renderTypeTableRow(property)}</GridItem>
                </Grid>
            </header>

            <div className="lumx-spacing-padding-vertical">
                <Text as="p" typography="body1">
                    {property.description}
                </Text>
            </div>
        </ExpansionPanel>
    );
};

const Table = ({ properties }: { properties: Property[] }) => (
    <div className="prop-table">
        {orderBy(properties, ['deprecated', 'required', 'name'], ['asc', 'desc', 'asc']).map((property, idx) => (
            <Fragment key={property.name}>
                <Row property={property} />

                {idx < properties.length - 1 && <Divider className="lumx-spacing-margin-vertical-regular" />}
            </Fragment>
        ))}
    </div>
);

export interface EventDoc {
    /** Event name. */
    name: string;
    /** Description. */
    description: string;
    /** Event parameters. */
    parameters: Array<{ name: string; type: string; optional: boolean }>;
}

export interface SlotDoc {
    /** Slot name. */
    name: string;
}

const EventsTable: React.FC<{ events: EventDoc[] }> = ({ events }) => (
    <div className="prop-table">
        {events.map((event, idx) => (
            <Fragment key={event.name}>
                <div className="prop-table__event">
                    <Grid hAlign={Alignment.center}>
                        <GridItem width="4">
                            <Text as="span" typography="subtitle1">
                                {event.name}
                            </Text>
                        </GridItem>
                        <GridItem width="8">
                            <Text as="span" typography="body1" className="prop-table__type">
                                (
                                {event.parameters.map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.type}`).join(', ')}
                                )
                            </Text>
                        </GridItem>
                    </Grid>
                    {event.description && (
                        <Text as="p" typography="body1" className="lumx-spacing-padding-top-regular">
                            {event.description}
                        </Text>
                    )}
                </div>
                {idx < events.length - 1 && <Divider className="lumx-spacing-margin-vertical-regular" />}
            </Fragment>
        ))}
    </div>
);

const SlotsTable: React.FC<{ slots: SlotDoc[] }> = ({ slots }) => (
    <div className="prop-table">
        {slots.map((slot, idx) => (
            <Fragment key={slot.name}>
                <div className="prop-table__slot">
                    <Text as="span" typography="subtitle1">
                        {slot.name}
                    </Text>
                </div>
                {idx < slots.length - 1 && <Divider className="lumx-spacing-margin-vertical-regular" />}
            </Fragment>
        ))}
    </div>
);

/**
 * Collapsible section for a single discriminated-union variant.
 */
const VariantSection: React.FC<{ discriminant: string; item: VariantItem; componentName: string }> = ({
    discriminant,
    item,
    componentName,
}) => {
    if (item.props.length === 0) {
        return null;
    }

    return (
        <details open={item.isDefault} name={componentName} className="prop-table__details">
            <summary>
                <Heading as="h4" style={{ display: 'inline-block' }}>
                    <code>
                        {discriminant} = &quot;{item.value}&quot;
                    </code>
                    {item.isDefault && ' (default)'}
                </Heading>
            </summary>
            <Table properties={item.props} />
        </details>
    );
};

/**
 * Type parameter legend block.
 */
const TypeParamsLegend: React.FC<{ typeParams: TypeParamDoc[] }> = ({ typeParams }) => (
    <div className="prop-table__type-params">
        <Text as="p">Generic type parameters:</Text>
        <dl className="prop-table__type-params-list">
            {typeParams.map(({ name, description }) => (
                <Fragment key={name}>
                    <dt>
                        <code>{name}</code>
                    </dt>
                    <dd>{description || <em>No description</em>}</dd>
                </Fragment>
            ))}
        </dl>
    </div>
);

export interface ComponentDoc {
    displayName: string;
    props: Property[];
    events?: EventDoc[];
    slots?: SlotDoc[];
    /** Component-level deprecation message from @deprecated JSDoc tag. */
    deprecated?: string;
    /** Discriminated-union variant groups (e.g. for MenuButton variants). */
    variants?: VariantDoc;
    /** Generic type parameter documentation (from @typeParam JSDoc). */
    typeParams?: TypeParamDoc[];
}

export interface PropTableProps {
    /** Component props doc. */
    docs?: { react?: ComponentDoc; vue?: ComponentDoc };
}

export const PropTable: React.FC<PropTableProps> = ({ docs }) => {
    const { framework } = useFramework();
    const componentDoc = docs?.[framework];
    const properties = componentDoc?.props;
    const componentName = componentDoc?.displayName;
    const events = componentDoc?.events;
    const slots = componentDoc?.slots;
    const deprecated = componentDoc?.deprecated;
    const variants = componentDoc?.variants;
    const typeParams = componentDoc?.typeParams;

    if (!properties || !componentName) {
        return (
            <Message kind="warning" hasBackground>
                Props table not available yet for {upperFirst(framework)}
            </Message>
        );
    }

    // Synthesise a discriminant prop row for the main table (e.g. `selectionType`, `variant`).
    // Its type lists the accepted literal values; required-ness is inherited from the original.
    const existingDiscriminant = variants && properties.find((p) => p.name === variants.discriminant);
    const discriminantProp: Property | null = variants
        ? {
              name: variants.discriminant,
              description: existingDiscriminant?.description ?? '',
              required: existingDiscriminant?.required ?? true,
              deprecated: existingDiscriminant?.deprecated ?? false,
              type: variants.items.map((item) => `"${item.value}"`),
              defaultValue: variants.items.find((item) => item.isDefault)?.value ?? '',
              declarations: existingDiscriminant?.declarations ?? [],
          }
        : null;

    // Remove original discriminant from properties to avoid duplicate.
    const filteredProperties = discriminantProp
        ? properties.filter((p) => p.name !== variants!.discriminant)
        : properties;

    const allProperties = discriminantProp ? [...filteredProperties, discriminantProp] : properties;

    const [forwardedProps, others] = partition(allProperties, (prop) =>
        prop.declarations?.some(({ fileName }) => fileName.match(/@types\/react/)),
    );

    return (
        <>
            {deprecated !== undefined && (
                <Message kind="warning" hasBackground className="lumx-spacing-margin-bottom-big">
                    <Text as="p" typography="body1">
                        <strong>Deprecated:</strong> {deprecated || 'This component is deprecated.'}
                    </Text>
                </Message>
            )}

            {typeParams && typeParams.length > 0 && <TypeParamsLegend typeParams={typeParams} />}

            {others.length > 0 && <Table properties={others} />}

            {variants && variants.items.some((item) => item.props.length > 0) && (
                <div className="prop-table__variants">
                    <Heading as="h4" typography="subtitle2" className="lumx-spacing-margin-bottom-regular">
                        Variant-specific props
                    </Heading>
                    {variants.items.map((item) => (
                        <VariantSection
                            componentName={componentName}
                            key={item.value}
                            discriminant={variants.discriminant}
                            item={item}
                        />
                    ))}
                </div>
            )}

            {forwardedProps.length ? (
                <details>
                    <summary>
                        <Heading as="h4" typography="subtitle2" style={{ display: 'inline-block' }}>
                            Forwarded props
                        </Heading>
                    </summary>
                    <Table properties={forwardedProps} />
                </details>
            ) : null}

            {events && events.length > 0 && (
                <>
                    <Heading as="h4" typography="subtitle2">
                        Events
                    </Heading>
                    <EventsTable events={events} />
                </>
            )}

            {slots && slots.length > 0 && (
                <>
                    <Heading as="h4" typography="subtitle2">
                        Slots
                    </Heading>
                    <SlotsTable slots={slots} />
                </>
            )}
        </>
    );
};
