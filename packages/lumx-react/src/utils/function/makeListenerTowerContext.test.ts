import { makeListenerTowerContext } from './makeListenerTowerContext';

describe('makeListenerTowerContext', () => {
    it('should enable first listener on register', () => {
        const context = makeListenerTowerContext();
        const listener = { enable: vi.fn(), disable: vi.fn() };

        context.register(listener);

        expect(listener.enable).toHaveBeenCalledTimes(1);
        expect(listener.disable).not.toHaveBeenCalled();
    });

    it('should disable previous listener when registering new one', () => {
        const context = makeListenerTowerContext();
        const listener1 = { enable: vi.fn(), disable: vi.fn() };
        const listener2 = { enable: vi.fn(), disable: vi.fn() };

        context.register(listener1);
        context.register(listener2);

        expect(listener1.enable).toHaveBeenCalledTimes(1);
        expect(listener1.disable).toHaveBeenCalledTimes(1);
        expect(listener2.enable).toHaveBeenCalledTimes(1);
        expect(listener2.disable).not.toHaveBeenCalled();
    });

    it('should enable previous listener on unregister', () => {
        const context = makeListenerTowerContext();
        const listener1 = { enable: vi.fn(), disable: vi.fn() };
        const listener2 = { enable: vi.fn(), disable: vi.fn() };

        context.register(listener1);
        context.register(listener2);
        context.unregister(listener2);

        expect(listener1.enable).toHaveBeenCalledTimes(2);
        expect(listener1.disable).toHaveBeenCalledTimes(1);
        expect(listener2.enable).toHaveBeenCalledTimes(1);
        expect(listener2.disable).toHaveBeenCalledTimes(1);
    });

    it('should enable previous listener when unregistering from top of stack', () => {
        const context = makeListenerTowerContext();
        const listener1 = { enable: vi.fn(), disable: vi.fn() };
        const listener2 = { enable: vi.fn(), disable: vi.fn() };
        const listener3 = { enable: vi.fn(), disable: vi.fn() };

        context.register(listener1);
        context.register(listener2);
        context.register(listener3);
        context.unregister(listener3);

        expect(listener2.enable).toHaveBeenCalledTimes(2);
        expect(listener3.disable).toHaveBeenCalledTimes(1);
    });

    it('should handle unregistering all listeners in reverse order', () => {
        const context = makeListenerTowerContext();
        const listener1 = { enable: vi.fn(), disable: vi.fn() };
        const listener2 = { enable: vi.fn(), disable: vi.fn() };
        const listener3 = { enable: vi.fn(), disable: vi.fn() };

        context.register(listener1);
        context.register(listener2);
        context.register(listener3);
        context.unregister(listener3);
        context.unregister(listener2);
        context.unregister(listener1);

        expect(listener1.enable).toHaveBeenCalledTimes(2);
        expect(listener1.disable).toHaveBeenCalledTimes(2);
        expect(listener2.enable).toHaveBeenCalledTimes(2);
        expect(listener2.disable).toHaveBeenCalledTimes(2);
    });
});
