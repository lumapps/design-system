import { Engine, EngineContext } from '@lumx/demo/context/engine';
import React, { ReactElement, useContext } from 'react';

import orderBy from 'lodash/orderBy';

import { Table, TableBody, TableCell, TableCellVariant, TableHeader, TableRow } from '@lumx/react';

// @ts-ignore
import { propsByComponent } from 'props-loader!';

const renderTypeTableRow = ({ type, defaultValue }: IProperty): ReactElement => {
    let formattedType = <>{type}</>;
    const splitType = type.split(defaultValue);

    if (splitType.length > 1) {
        formattedType = (
            <>
                {splitType[0]}
                <strong>{defaultValue}</strong>
                {splitType[1]}
            </>
        );
    } else if (splitType.length === 1 && defaultValue) {
        formattedType = (
            <>
                {type}
                {' (default: '}
                <strong>{defaultValue}</strong>
                {')'}
            </>
        );
    }

    return (
        <TableCell>
            <code>{formattedType}</code>
        </TableCell>
    );
};

const PropTable: React.FC<IPropTableProps> = ({ component }: IPropTableProps): ReactElement => {
    const { engine } = useContext(EngineContext);
    if (engine === Engine.angularjs) {
        return <span>Could not load properties of the angular.js {component} component.</span>;
    }

    const propertyList: IProperty[] = propsByComponent[component];

    if (!propertyList) {
        return <span>Could not load properties of the react {component} component.</span>;
    }
    return (
        <Table hasDividers>
            <TableHeader>
                <TableRow>
                    <TableCell variant={TableCellVariant.head}>Name</TableCell>
                    <TableCell variant={TableCellVariant.head}>Type</TableCell>
                    <TableCell variant={TableCellVariant.head}>Description</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orderBy(propertyList, ['required', 'name'], ['desc', 'asc']).map((property: IProperty) => {
                    return (
                        <TableRow key={property.id}>
                            {property.required ? (
                                <TableCell>
                                    <strong>{`${property.name} *`}</strong>
                                </TableCell>
                            ) : (
                                <TableCell>{property.name}</TableCell>
                            )}
                            {renderTypeTableRow(property)}
                            <TableCell>{property.description}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

interface IProperty {
    id: string;
    name: string;
    required: boolean;
    type: string;
    description: string;
    defaultValue: string;
}

interface IPropTableProps {
    component: string;
}

export { PropTable, IProperty };
