/** Build a shadow root with the page styles copied in, for a story that needs its own styled shadow root. */
export const initDemoShadowRoot = () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    // Vite injects a `style` tag in dev and a `link` in the built Storybook, so both must be copied.
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
        shadowRoot.appendChild(node.cloneNode(true));
    });
    shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets];

    return { host, shadowRoot, teardown: () => host.remove() };
};
