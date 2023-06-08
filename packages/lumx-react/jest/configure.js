import '@testing-library/jest-dom';

/**
 * Mock the intersection observer.
 */
global.IntersectionObserver = class IntersectionObserver {
    constructor() {
        this.observe = jest.fn();
        this.unobserve = jest.fn();
        this.disconnect = jest.fn();
    }
};
