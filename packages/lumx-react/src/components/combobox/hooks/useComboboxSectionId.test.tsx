import { render } from '@testing-library/react';
import { useComboboxSectionId } from './useComboboxSectionId';
import { SectionContext } from '../context/ComboboxContext';

describe('useComboboxSectionId', () => {
    it('should return section id from context', () => {
        let result: any;
        const TestComponent = () => {
            result = useComboboxSectionId();
            return null;
        };
        render(
            <SectionContext.Provider value={{ sectionId: 'section-1' }}>
                <TestComponent />
            </SectionContext.Provider>,
        );
        expect(result).toEqual({ sectionId: 'section-1' });
    });

    it('should return section id with loading state', () => {
        let result: any;
        const TestComponent = () => {
            result = useComboboxSectionId();
            return null;
        };
        render(
            <SectionContext.Provider value={{ sectionId: 'section-2', isLoading: true }}>
                <TestComponent />
            </SectionContext.Provider>,
        );
        expect(result).toEqual({ sectionId: 'section-2', isLoading: true });
    });

    it('should return default empty section id when no provider', () => {
        let result: any;
        const TestComponent = () => {
            result = useComboboxSectionId();
            return null;
        };
        render(<TestComponent />);
        expect(result).toEqual({ sectionId: '' });
    });
});
