import { Table, TableBody, TableCell, TableCellVariant, TableHeader, TableRow } from 'LumX';
import React, { ReactElement } from 'react';

export const PropTable: React.FC<IPropTableProps> = ({ propertyList }: IPropTableProps): ReactElement => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell variant={TableCellVariant.head}>Name</TableCell>
                    <TableCell variant={TableCellVariant.head} width="100px">
                        Required
                    </TableCell>
                    <TableCell variant={TableCellVariant.head}>Type</TableCell>
                    <TableCell variant={TableCellVariant.head} width="40%">
                        Description
                    </TableCell>
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
}

interface IPropTableProps {
    propertyList: IProperty[];
}
