import { Table, TableBody, TableCell, TableCellVariant, TableHeader, TableRow } from 'LumX';
import React, { ReactElement } from 'react';

const PropTable: React.FC<IPropTableProps> = ({ propertyList }: IPropTableProps): ReactElement => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell variant={TableCellVariant.head}>Name</TableCell>
                    <TableCell variant={TableCellVariant.head} width="80px">
                        Required
                    </TableCell>
                    <TableCell variant={TableCellVariant.head}>Type</TableCell>
                    <TableCell variant={TableCellVariant.head}>Default value</TableCell>
                    <TableCell variant={TableCellVariant.head}>Description</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {propertyList.map((property: IProperty) => {
                    return (
                        <TableRow key={property.id}>
                            <TableCell>{property.name}</TableCell>
                            <TableCell>{(property.required && 'true') || 'false'}</TableCell>
                            <TableCell>
                                <code>{property.type}</code>
                            </TableCell>
                            <TableCell>{property.defaultValue}</TableCell>
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
    defaultValue: string | undefined;
}

interface IPropTableProps {
    propertyList: IProperty[];
}

export { PropTable, IProperty };
