import omit from 'lodash/omit';

export const withSlot = (args: any) => {
    return { args: omit(args, 'children'), slot: args.children };
};
