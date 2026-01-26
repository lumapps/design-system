/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(
        class {
            disconnect = vi.fn();

            observe = vi.fn();

            unobserve = vi.fn();
        },
    ),
);
