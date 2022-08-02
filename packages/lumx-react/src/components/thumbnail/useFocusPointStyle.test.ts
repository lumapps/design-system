import { shiftPosition } from './useFocusPointStyle';

describe('shiftPosition', () => {
    it('should always return 0% if the imageSize fits the containerSize', () => {
        expect(
            shiftPosition({
                scale: 1.5,
                focusPoint: 0,
                imageSize: 1200,
                containerSize: 800,
            }),
        ).toEqual(0);
        expect(
            shiftPosition({
                scale: 1,
                focusPoint: 0.27,
                imageSize: 1000,
                containerSize: 1000,
            }),
        ).toEqual(0);
        expect(
            shiftPosition({
                scale: 3,
                focusPoint: 0.5,
                imageSize: 1200,
                containerSize: 400,
            }),
        ).toEqual(0);
        expect(
            shiftPosition({
                scale: 2.4,
                focusPoint: 1,
                imageSize: 1200,
                containerSize: 500,
            }),
        ).toEqual(0);
    });

    describe('with bigger side than container ', () => {
        // This use case will come, for example, if you have an image in width 100%
        // but the image after being resized to keep the ratio is higher than the container.
        // Then we are calculating the y shift.

        const image = { width: 1000, height: 1200 };
        const container = { width: 1000, height: 300 };
        // scale is always the minimum scale ratio. Here imagewidth/containerwidth.
        const scale = image.width / container.width; // 1
        it('should return 0% if focusPoint equals 0', () => {
            expect(
                shiftPosition({
                    scale,
                    focusPoint: 0,
                    imageSize: image.height,
                    containerSize: container.height,
                }),
            ).toEqual(0);
        });

        it('should return 100% if focusPoint equals 1', () => {
            expect(
                shiftPosition({
                    scale,
                    focusPoint: 1,
                    imageSize: image.height,
                    containerSize: container.height,
                }),
            ).toEqual(100);
        });

        it('should return 50% if focusPoint equals 0.5', () => {
            expect(
                shiftPosition({
                    scale,
                    focusPoint: 0.5,
                    imageSize: image.height,
                    containerSize: container.height,
                }),
            ).toEqual(50);
        });

        it('should return 16% if focusPoint equals 0.25', () => {
            expect(
                shiftPosition({
                    scale,
                    focusPoint: 0.25,
                    imageSize: image.height,
                    containerSize: container.height,
                }),
            ).toEqual(16);
        });
    });
});
