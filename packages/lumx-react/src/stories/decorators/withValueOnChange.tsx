import React from 'react';
import over from 'lodash/over';
import identity from 'lodash/identity';

export const withValueOnChange = ({
    valueProp = 'value',
    valueTransform = identity,
    onChangeProp = 'onChange',
    valueExtract = identity,
}: {
    valueProp?: string;
    valueTransform?: (v: any) => any;
    onChangeProp?: string;
    valueExtract?: (v: any) => any;
} = {}) => {
    // eslint-disable-next-line react/display-name
    return (Story: any, ctx: any) => {
        const [value, setValue] = React.useState(ctx.args[valueProp]);
        const args = {
            ...ctx.args,
            [onChangeProp]: over([(v: any) => setValue(valueExtract(v)), ctx.args[onChangeProp]]),
            [valueProp]: valueTransform(value),
        };
        return <Story args={args} />;
    };
};
