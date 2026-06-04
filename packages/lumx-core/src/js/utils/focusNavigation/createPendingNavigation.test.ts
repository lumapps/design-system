// @vitest-environment jsdom
import { createPendingNavigation } from './createPendingNavigation';

describe('createPendingNavigation', () => {
    it('should report no pending intent initially', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        expect(pending.hasPending).toBe(false);
    });

    it('should store a deferred intent', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        pending.defer(() => true);
        expect(pending.hasPending).toBe(true);
    });

    it('should run and clear the intent on flush when it returns true', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        const navigate = vi.fn(() => true);
        pending.defer(navigate);

        pending.flush();

        expect(navigate).toHaveBeenCalledTimes(1);
        expect(pending.hasPending).toBe(false);
    });

    it('should keep the intent pending when the thunk returns false', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        const navigate = vi.fn(() => false);
        pending.defer(navigate);

        pending.flush();

        expect(navigate).toHaveBeenCalledTimes(1);
        expect(pending.hasPending).toBe(true);
    });

    it('should retry on subsequent flushes until the thunk succeeds', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        let ready = false;
        const navigate = vi.fn(() => ready);
        pending.defer(navigate);

        pending.flush(); // not ready yet
        expect(pending.hasPending).toBe(true);

        ready = true;
        pending.flush(); // now succeeds
        expect(navigate).toHaveBeenCalledTimes(2);
        expect(pending.hasPending).toBe(false);

        // No more retries once cleared.
        pending.flush();
        expect(navigate).toHaveBeenCalledTimes(2);
    });

    it('should do nothing on flush when there is no pending intent', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        expect(() => pending.flush()).not.toThrow();
        expect(pending.hasPending).toBe(false);
    });

    it('should replace a previously deferred intent', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        const first = vi.fn(() => true);
        const second = vi.fn(() => true);
        pending.defer(first);
        pending.defer(second);

        pending.flush();

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('should discard the intent on clear without running it', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        const navigate = vi.fn(() => true);
        pending.defer(navigate);

        pending.clear();

        expect(pending.hasPending).toBe(false);
        pending.flush();
        expect(navigate).not.toHaveBeenCalled();
    });

    it('should discard the intent on abort', () => {
        const ac = new AbortController();
        const pending = createPendingNavigation(ac.signal);
        const navigate = vi.fn(() => true);
        pending.defer(navigate);

        ac.abort();

        expect(pending.hasPending).toBe(false);
        pending.flush();
        expect(navigate).not.toHaveBeenCalled();
    });
});
