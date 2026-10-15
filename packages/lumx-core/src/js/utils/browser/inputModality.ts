/** The type of the last user input. */
export type InputModality = 'keyboard' | 'pointer';

let lastModality: InputModality | undefined;

const setKeyboard = () => {
    lastModality = 'keyboard';
};
const setPointer = () => {
    lastModality = 'pointer';
};

// Listen as soon as the module loads, to know the modality of the interactions that happen before a component
// mounts (ex: the key press that opens a dialog and moves the focus to a field in it).
if (typeof document !== 'undefined') {
    const options = { capture: true, passive: true };
    document.addEventListener('keydown', setKeyboard, options);
    document.addEventListener('pointerdown', setPointer, options);
    document.addEventListener('mousedown', setPointer, options);
    document.addEventListener('touchstart', setPointer, options);
}

/**
 * Get the type of the last user input (keyboard or pointer), `undefined` before any user input.
 *
 * A programmatic focus has the modality of the user input that caused it (like `:focus-visible`):
 * a focus moved by a script after a key press is a keyboard focus.
 */
export const getInputModality = (): InputModality | undefined => lastModality;
