import { Alignment, Divider, ExpansionPanel, Grid, GridItem, Heading } from '@lumx/react';
import partition from 'lodash/partition';
import orderBy from 'lodash/orderBy';
import { Fragment, ReactNode, useState } from 'react';
import { castArray } from '@lumx/core/js/utils/collection/castArray';

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
                acc.push(<strong>{defaultValue}</strong>);
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

export interface PropTableProps {
    /** Component name. */
    component: string;
    /** Component props doc. */
    props?: Property[];
}

export const PropTable: React.FC<PropTableProps> = ({ component, props }) => {
    if (!props) {
        return <span>Could not load properties of the {component} component.</span>;
    }

    const [forwardedProps, others] = partition(props, (prop) =>
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
