import { defineComponent, h, ref } from 'vue';
import { render } from '@testing-library/vue';
import { AspectRatio } from '@lumx/core/js/constants';
import { useFocusPointStyle } from './useFocusPointStyle';

describe('useFocusPointStyle', () => {
    const createMockImage = (props: Partial<HTMLImageElement> = {}): HTMLImageElement =>
        ({
            naturalWidth: 800,
            naturalHeight: 600,
            offsetWidth: 400,
            offsetHeight: 300,
            ...props,
        }) as unknown as HTMLImageElement;

    const TestComponent = defineComponent({
        props: ['params'],
        setup(props) {
            const params = {
                image: ref(props.params.image || ''),
                aspectRatio: ref(props.params.aspectRatio),
                focusPoint: ref(props.params.focusPoint),
                width: ref(props.params.width),
                height: ref(props.params.height),
                element: ref(props.params.element),
                isLoaded: ref(props.params.isLoaded ?? false),
            };

            const style = useFocusPointStyle(params);

            return () =>
                h('div', { 'data-testid': 'container' }, [
                    h('span', { 'data-testid': 'object-position' }, style.value.objectPosition || 'none'),
                    h('span', { 'data-testid': 'visibility' }, style.value.visibility || 'none'),
                ]);
        },
    });

    it('should return empty object when image URL is not provided', () => {
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    aspectRatio: AspectRatio.square,
                    focusPoint: { x: 0.5 },
                    isLoaded: true,
                },
            },
        });

        expect(getByTestId('object-position').textContent).toBe('none');
        expect(getByTestId('visibility').textContent).toBe('none');
    });

    it('should return empty object when aspectRatio is original', () => {
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.original,
                    focusPoint: { x: 0.5 },
                    isLoaded: true,
                },
            },
        });

        expect(getByTestId('object-position').textContent).toBe('none');
        expect(getByTestId('visibility').textContent).toBe('none');
    });

    it('should return empty object when focus point is not set', () => {
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.square,
                    isLoaded: true,
                },
            },
        });

        expect(getByTestId('object-position').textContent).toBe('none');
        expect(getByTestId('visibility').textContent).toBe('none');
    });

    it('should return visibility hidden when element is not provided', () => {
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.square,
                    focusPoint: { x: 0.5 },
                    width: 800,
                    height: 600,
                    isLoaded: true,
                },
            },
        });

        expect(getByTestId('visibility').textContent).toBe('hidden');
    });

    it('should calculate objectPosition when all params are provided', () => {
        const img = createMockImage();
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.square,
                    focusPoint: { x: 0.5, y: 0.5 },
                    element: img,
                    isLoaded: true,
                },
            },
        });

        // Should have calculated objectPosition
        expect(getByTestId('object-position').textContent).toMatch(/^\d+% \d+%$/);
        expect(getByTestId('visibility').textContent).toBe('none');
    });

    it('should handle focus point with only x coordinate', () => {
        const img = createMockImage();
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.square,
                    focusPoint: { x: 0.5 },
                    element: img,
                    isLoaded: true,
                },
            },
        });

        expect(getByTestId('object-position').textContent).toMatch(/^\d+% \d+%$/);
    });

    it('should handle focus point with only y coordinate', () => {
        const img = createMockImage();
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.square,
                    focusPoint: { y: 0.5 },
                    element: img,
                    isLoaded: true,
                },
            },
        });

        expect(getByTestId('object-position').textContent).toMatch(/^\d+% \d+%$/);
    });

    it('should use width and height from props when provided as numbers', () => {
        const img = createMockImage();
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.square,
                    focusPoint: { x: 0.5, y: 0.5 },
                    width: 1000,
                    height: 750,
                    element: img,
                    isLoaded: true,
                },
            },
        });

        // Should have calculated objectPosition using provided dimensions
        expect(getByTestId('object-position').textContent).toMatch(/^\d+% \d+%$/);
    });

    it('should ignore width and height when provided as strings', () => {
        const img = createMockImage();
        const { getByTestId } = render(TestComponent, {
            props: {
                params: {
                    image: 'test.jpg',
                    aspectRatio: AspectRatio.square,
                    focusPoint: { x: 0.5, y: 0.5 },
                    width: '100%',
                    height: 'auto',
                    element: img,
                    isLoaded: true,
                },
            },
        });

        // Should still calculate using natural dimensions from element
        expect(getByTestId('object-position').textContent).toMatch(/^\d+% \d+%$/);
    });
});
