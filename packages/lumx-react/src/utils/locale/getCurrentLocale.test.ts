import { vi } from 'vitest';
import { getCurrentLocale } from './getCurrentLocale';

describe('getCurrentLocale', () => {
    it('should return first language from languages', () => {
        vi.stubGlobal('navigator', { languages: ['fr-FR', 'en-US'], language: 'en-US' });
        expect(getCurrentLocale()).toBe('fr-FR');
    });

    it('should fallback to language if languages is empty', () => {
        vi.stubGlobal('navigator', { languages: [], language: 'en-US' });
        expect(getCurrentLocale()).toBe('en-US');
    });
});
