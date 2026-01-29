import { Alignment, Divider, ExpansionPanel, Grid, GridItem, Heading } from '@lumx/react';
import partition from 'lodash/partition';
import castArray from 'lodash/castArray';
import orderBy from 'lodash/orderBy';
import { Fragment, ReactNode, useState } from 'react';

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
}

const renderTypeTableRow = ({ type, defaultValue }: Property) => (
    <span className="prop-table__type lumx-typography-body1">
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
    </span>
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
                        {property.required ? (
                            <span className="lumx-typography-subtitle1">{`${property.name} *`}</span>
                        ) : (
                            <span className="lumx-typography-body1">{property.name}</span>
                        )}
                    </GridItem>

                    <GridItem width="8">{renderTypeTableRow(property)}</GridItem>
                </Grid>
            </header>

            <div className="lumx-spacing-padding-vertical">
                <p className="lumx-typography-body1">{property.description}</p>
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

export interface ComponentDoc {
    displayName: string;
    props: Property[];
}

export interface PropTableProps {
    /** Component props doc. */
    docs?: { react?: ComponentDoc };
}

export const PropTable: React.FC<PropTableProps> = ({ docs }) => {
    const properties = docs?.react?.props;
    const componentName = docs?.react?.displayName;

    if (!properties) {
        return <span>Could not load properties{componentName ? ` of the ${componentName} component` : ''}.</span>;
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
        </>
    );
};
