import { Kind } from '../../constants';

export const INPUT_HELPER_CONFIGURATION: Record<string, { color: string }> = {
    [Kind.error]: { color: 'red' },
    [Kind.success]: { color: 'green' },
    [Kind.warning]: { color: 'yellow' },
};
