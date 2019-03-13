import isEmpty from 'lodash/isEmpty';

/////////////////////////////

/**
 * Insert an element after another.
 *
 * @param {DOMElement} newNode       The node to insert.
 * @param {DOMElement} referenceNode The node to insert after.
 */
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Inject a script in the DOM.
 *
 * @param  {string}  scriptPath  The path to the script to inject.
 * @param  {string}  [id]        The HTML id of the script element.
 * @param  {string}  [afterId]   The HTML id of the element to inject the script after.
 * @param  {boolan}  [wait=true] Indicates if we want to wait for the script to be loaded before resolving the promise.
 * @return {Promise} A promise that resolves when the script has been loaded.
 */
function injectScript(scriptPath, id, afterId, wait = true) {
    return new Promise((resolve) => {
        const newScript = document.createElement('script');

        let afterElement;
        let targetElement = document.body;
        if (!isEmpty(afterId)) {
            afterElement = document.getElementById(afterId);

            if (!isEmpty(afterElement)) {
                targetElement = afterElement.parentNode;
            }
        }

        if (!isEmpty(id)) {
            newScript.id = id;
        }

        if (isEmpty(afterElement)) {
            targetElement.append(newScript);
        } else {
            insertAfter(newScript, afterElement);
        }

        if (wait) {
            newScript.addEventListener('load', resolve);
            newScript.addEventListener('error', resolve);
        }

        newScript.charset = 'UTF-8';
        newScript.src = scriptPath;

        if (!wait) {
            resolve();
        }
    });
}

/**
 * Change the theme.
 * This will change the theme of the demo site and the theme of LumX.
 * This will also cleanup the DOM and remove old themes styles and scripts.
 *
 * @param  {string}  theme The theme to enable.
 *                         Possible values are: 'lumapps' or 'material'.
 * @return {Promise} The promise of the change.
 */
function changeTheme(theme) {
    // eslint-disable-next-line no-unused-expressions
    document.getElementById('demo-theme')?.remove();
    // eslint-disable-next-line no-unused-expressions
    document.getElementById('lumx-theme')?.remove();

    const promises = [
        injectScript(`demo-theme-${theme}.js`, 'demo-theme', undefined, true),
        injectScript(`lumx-theme-${theme}.js`, 'lumx-theme', undefined, true),
    ];

    return Promise.all(promises).then(() => {
        const styleTags = Array.prototype.slice.call(document.head.getElementsByTagName('style')).reverse();

        const stylesFound = {
            demo: false,
            lumx: false,
        };

        styleTags.forEach((styleTag) => {
            const content = styleTag.textContent || '';

            if (content.indexOf('/** DEMO THEME */') > -1) {
                if (stylesFound.demo) {
                    styleTag.remove();
                } else {
                    stylesFound.demo = true;
                }
            } else if (content.indexOf('/** LUMX THEME */') > -1) {
                if (stylesFound.lumx) {
                    styleTag.remove();
                } else {
                    stylesFound.lumx = true;
                }
            }
        });
    });
}

/////////////////////////////

export { changeTheme };
