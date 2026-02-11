import { defineComponent, h, ref } from 'vue';
import { render } from '@testing-library/vue';
import { useImageLoad } from './useImageLoad';

describe('useImageLoad', () => {
    const createMockImage = (props: Partial<HTMLImageElement> = {}): HTMLImageElement =>
        ({
            complete: false,
            getAttribute: (attr: string) => (attr === 'src' && props.src) || null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            ...props,
        }) as unknown as HTMLImageElement;

    const TestComponent = defineComponent({
        props: ['imageURL', 'imgElement'],
        setup(props) {
            const imageURL = ref(props.imageURL);
            const imgRef = ref(props.imgElement);
            const loadingState = useImageLoad(imageURL, imgRef);

            return () =>
                h('div', { 'data-testid': 'state' }, [
                    h('span', { 'data-testid': 'loading-state' }, loadingState.value),
                ]);
        },
    });

    it('should return isLoading when image is null', () => {
        const { getByTestId } = render(TestComponent, {
            props: { imageURL: 'test.jpg', imgElement: undefined },
        });

        expect(getByTestId('loading-state').textContent).toBe('isLoading');
    });

    it('should return isLoading when image is not complete', () => {
        const img = createMockImage({ src: 'test.jpg', complete: false });
        const { getByTestId } = render(TestComponent, {
            props: { imageURL: 'test.jpg', imgElement: img },
        });

        expect(getByTestId('loading-state').textContent).toBe('isLoading');
    });

    it('should return isLoaded when image is complete and has src', () => {
        const img = createMockImage({ src: 'test.jpg', complete: true });
        const { getByTestId } = render(TestComponent, {
            props: { imageURL: 'test.jpg', imgElement: img },
        });

        expect(getByTestId('loading-state').textContent).toBe('isLoaded');
    });

    it('should return hasError when image is complete but has no src', () => {
        const img = createMockImage({ complete: true });
        const { getByTestId } = render(TestComponent, {
            props: { imageURL: 'test.jpg', imgElement: img },
        });

        expect(getByTestId('loading-state').textContent).toBe('hasError');
    });

    it('should add event listeners to image element', () => {
        const img = createMockImage({ src: 'test.jpg' });
        render(TestComponent, {
            props: { imageURL: 'test.jpg', imgElement: img },
        });

        expect(img.addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
        expect(img.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should remove event listeners on unmount', () => {
        const img = createMockImage({ src: 'test.jpg' });
        const { unmount } = render(TestComponent, {
            props: { imageURL: 'test.jpg', imgElement: img },
        });

        unmount();

        expect(img.removeEventListener).toHaveBeenCalledWith('load', expect.any(Function));
        expect(img.removeEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    });
});
