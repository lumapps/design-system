import { COMPAT_OPTIONS } from './compatOptions';

describe('COMPAT_OPTIONS', () => {
    it('declares Vue 3 behaviour for compat', () => {
        expect((COMPAT_OPTIONS as { compatConfig: { MODE: number } }).compatConfig.MODE).toBe(3);
    });
});
