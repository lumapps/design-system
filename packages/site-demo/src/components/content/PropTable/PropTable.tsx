import React, { Fragment, ReactNode, useState } from 'react';
import partition from 'lodash/partition';
import castArray from 'lodash/castArray';
import orderBy from 'lodash/orderBy';
import upperFirst from 'lodash/upperFirst';

import { Alignment, Divider, ExpansionPanel, Grid, GridItem, Heading, Message, Text } from '@lumx/react';
import { useFramework } from '@lumx/demo/components/layout/FrameworkContext';

import './PropTable.scss';

export interface Property {
    /** Name. */
    name: string;
    /** Required flag. */
    required: boolean;
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
                <Grid hAlign={Alignment.center}>
                    <GridItem width="4">
                        <Text as="span" typography="body1">
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
        {orderBy(properties, ['required', 'name'], ['desc', 'asc']).map((property, idx) => (
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

export interface ComponentDoc {
    displayName: string;
    props: Property[];
    events?: EventDoc[];
    slots?: SlotDoc[];
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

    if (!properties || !componentName) {
        return (
            <Message kind="warning" hasBackground>
                Props table not available yet for {upperFirst(framework)}
            </Message>
        );
    }

    const [forwardedProps, others] = partition(properties, (prop) =>
        prop.declarations?.some(({ fileName }) => fileName.match(/@types\/react/)),
    );

    return (
        <>
            <Table properties={others} />
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
