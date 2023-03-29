const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

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
