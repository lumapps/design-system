import { Alignment, Divider, ExpansionPanel, Grid, GridItem } from '@lumx/react';
import castArray from 'lodash/castArray';
import orderBy from 'lodash/orderBy';
import React, { Fragment, ReactNode, useState } from 'react';

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
}

const renderTypeTableRow = ({ type, defaultValue }: Property) => (
    <span className="lumx-typography-body1">
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
            <>
                {' (default: '}
                <strong>{defaultValue}</strong>
                {')'}
            </>
        )}
    </span>
);

const PropTableRow: React.FC<{ property: Property }> = ({ property }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <ExpansionPanel label="Lorem ipsum" isOpen={isOpen} onToggleOpen={toggleOpen}>
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

    return (
        <div className="prop-table">
            {orderBy(props, ['required', 'name'], ['desc', 'asc']).map((property, idx) => (
                <Fragment key={property.name}>
                    <PropTableRow property={property} />

                    {idx < props.length - 1 && <Divider className="lumx-spacing-margin-vertical-regular" />}
                </Fragment>
            ))}
        </div>
    );
};
