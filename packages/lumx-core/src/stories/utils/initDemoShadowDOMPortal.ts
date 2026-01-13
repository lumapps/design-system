/** Init a demo shadow DOM to use as portal container */
export const initDemoShadowDOMPortal = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const container = div.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.innerText = `button { color: red; }`;
    container.appendChild(style);
    return { container, teardown: () => div.remove() };
};
