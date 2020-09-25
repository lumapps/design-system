// Credits: https://github.com/third774/image-focus/
import debounce from 'lodash/debounce';
import { FocusPoint, FocusedImageOptions } from './FocusedImageOptions';

const CONTAINER_STYLES = {
    overflow: 'hidden',
    position: 'relative',
};

const ABSOLUTE_STYLES = {
    bottom: '0',
    left: '0',
    position: 'absolute',
    right: '0',
    top: '0',
};

const IMG_STYLES = {
    // Set these styles in case the image dimensions
    // are smaller than the container's
    minHeight: '100%',
    minWidth: '100%',
};

export interface LumHTMLImageElement extends HTMLImageElement {
    __focused_image_instance__: FocusedImage;
}

export class FocusedImage {
    public focus: FocusPoint;
    public options: FocusedImageOptions;
    public container: HTMLElement;
    public img: LumHTMLImageElement;
    public resizeListenerObject?: HTMLObjectElement;
    public listening: boolean = false;
    public debounceApplyShift: () => void;

    constructor(private readonly imageNode: LumHTMLImageElement, options: FocusedImageOptions) {
        // Merge in options
        this.options = options;

        // Set up element references
        this.img = imageNode;
        this.container = imageNode.parentElement!;

        // Set up instance
        if (this.img.__focused_image_instance__) {
            this.img.__focused_image_instance__.stopListening();
            this.img.removeEventListener('load', this.applyShift);
        }
        this.img.__focused_image_instance__ = this;

        // Add image load event listener
        this.img.addEventListener('load', this.applyShift);

        // Set up styles
        Object.assign(this.container.style, CONTAINER_STYLES);
        this.container.style.position = this.options.containerPosition as string;
        Object.assign(this.img.style, IMG_STYLES, ABSOLUTE_STYLES);

        // Create debouncedShift function
        this.debounceApplyShift = debounce(this.applyShift, this.options.debounceTime);

        // Initialize focus
        this.focus = this.options.focus;

        // Start listening for resize events
        this.startListening();

        // Set focus
        this.setFocus(this.focus);
    }

    public setFocus = (focus: FocusPoint) => {
        this.focus = focus;
        this.img.setAttribute('data-focus-x', focus.x.toString());
        this.img.setAttribute('data-focus-y', focus.y.toString());
        this.applyShift();
    };

    public applyShift = () => {
        const { naturalWidth: imageW, naturalHeight: imageH } = this.img;
        const { width: containerW, height: containerH } = this.container.getBoundingClientRect();

        // Amount position will be shifted
        let hShift = '0';
        let vShift = '0';

        if (!(containerW > 0 && containerH > 0 && imageW > 0 && imageH > 0)) {
            return false; // Need dimensions to proceed
        }

        // Which is over by more?
        const wR = imageW / containerW;
        const hR = imageH / containerH;

        // Reset max-width and -height
        this.img.style.maxHeight = '';
        this.img.style.maxWidth = '';

        // Minimize image while still filling space
        if (imageW > containerW && imageH > containerH) {
            this.img.style[wR > hR ? 'maxHeight' : 'maxWidth'] = '100%';
        }

        if (wR > hR) {
            hShift = `${this.calcShift(hR, containerW, imageW, this.focus.x)}%`;
        } else if (wR < hR) {
            vShift = `${this.calcShift(wR, containerH, imageH, this.focus.y, true)}%`;
        }

        this.img.style.top = vShift;
        this.img.style.left = hShift;
    };

    public startListening() {
        if (this.listening || !this.options.updateOnContainerResize) {
            return;
        }
        this.listening = true;
        if (this.options.updateOnWindowResize) {
            window.addEventListener('resize', this.debounceApplyShift);
        }
    }

    public stopListening() {
        if (!this.listening) {
            return;
        }
        this.listening = false;
        window.removeEventListener('resize', this.debounceApplyShift);

        if (!this.resizeListenerObject) {
            return;
        }

        this.resizeListenerObject.contentDocument?.defaultView?.removeEventListener('resize', this.debounceApplyShift);
        this.container.removeChild(this.resizeListenerObject);
        delete this.resizeListenerObject;
    }

    // Calculate the new left/top percentage shift of an image
    private calcShift(
        conToImageRatio: number,
        containerSize: number,
        imageSize: number,
        focusSize: number,
        toMinus?: boolean,
    ) {
        const containerCenter = Math.floor(containerSize / 2); // Container center in px
        const focusFactor = (focusSize + 1) / 2; // Focus point of resize image in px
        const scaledImage = Math.floor(imageSize / conToImageRatio); // Can't use width() as images may be display:none
        let focus = Math.floor(focusFactor * scaledImage);
        if (toMinus) {
            focus = scaledImage - focus;
        }
        let focusOffset = focus - containerCenter; // Calculate difference between focus point and center
        const remainder = scaledImage - focus; // Reduce offset if necessary so image remains filled
        const containerRemainder = containerSize - containerCenter;
        if (remainder < containerRemainder) {
            focusOffset -= containerRemainder - remainder;
        }
        if (focusOffset < 0) {
            focusOffset = 0;
        }

        return (focusOffset * -100) / containerSize;
    }
}
