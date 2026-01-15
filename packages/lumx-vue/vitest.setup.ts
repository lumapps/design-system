/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock the intersection observer for Vitest
global.IntersectionObserver = class IntersectionObserver {
    root = null;

    rootMargin = '';

    thresholds = [];

    observe = vi.fn();

    unobserve = vi.fn();

    disconnect = vi.fn();

    takeRecords = vi.fn();
};
