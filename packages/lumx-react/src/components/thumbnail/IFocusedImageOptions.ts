import { IFocus } from './IFocus';

// Credits: https://github.com/third774/image-focus/
export interface IFocusedImageOptions {
    /**
     * Time in MS before debounceApplyShift fires
     *
     * Defaults to `17`
     */
    debounceTime?: number;
    /**
     * Should window resize events fire debounceApplyShift?
     *
     * Defaults to `true`
     */
    updateOnWindowResize?: boolean;
    /**
     * Should container resize (even from CSS) fire debounceApplyShift?
     *
     * Defaults to `false`
     */
    updateOnContainerResize?: boolean;
    /**
     * Focus coordinates to initialize with
     *
     * Default value is `undefined`
     */
    focus?: IFocus;
    /**
     * Container position
     *
     * Default value is "relative"
     */
    containerPosition?: 'fixed' | 'relative' | 'absolute' | 'sticky';
}
