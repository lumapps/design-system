import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';

export const cleanArgs = (args: any) => {
    const events = pickBy(args, (value, key) => key.startsWith('on') && typeof value === 'function');
    return { args: omit(args, ['children', ...Object.keys(events)]), slot: args.children, events, ...events };
};
