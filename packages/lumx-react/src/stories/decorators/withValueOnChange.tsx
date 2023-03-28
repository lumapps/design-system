import React from 'react';
import over from 'lodash/over';
import identity from 'lodash/identity';

export const withValueOnChange = ({
    valueProp = 'value',
    valueTransform = identity,
}: {
    valueProp?: string;
    valueTransform?: (v: any) => any;
} = {}) => {
    // eslint-disable-next-line react/display-name
    return (Story: any, ctx: any) => {
        const [value, onChange] = React.useState(ctx.args[valueProp]);
        const args = { ...ctx.args, onChange: over([onChange, ctx.args.onChange]), [valueProp]: valueTransform(value) };
        return <Story args={args} />;
    };
};
