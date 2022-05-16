const fs = require('fs');
const cleanExcerpt = require('./cleanExcerpt');
const htmlparser2 = require('htmlparser2');

// Extract only the main content
const INCLUDE_PATTERN = /\b.main-content\b/;

// Ignored blocks
const EXCLUDE_PATTERNS = [
    /\b.demo-block\b/,
    /\b.design-token__version\b/,
    /\b.prop-table__type\b/,
    /^pre\b/,
];

function extractTextFromHTML(html) {
    let text = '';
    const parents = [];
    const parser = new htmlparser2.Parser(
        {
            onopentag(name, attributes) {
                const classes = attributes.class && attributes.class.split(/\s+/) || [];
                parents.push([name, ...classes].filter(Boolean).join('.'));
            },
            onclosetag() {
                parents.pop();
                if (!text.endsWith(' ')) text += ' ';
            },
            ontext(currentText) {
                if (
                    !parents.some(parent => parent.match(INCLUDE_PATTERN))
                    || parents.some(parent => EXCLUDE_PATTERNS.some(pattern => parent.match(pattern)))
                ) {
                    // Skip if parent not included or explicitly excluded.
                    return;
                }
                text += currentText;
            },
        },
        { decodeEntities: true },
    );
    parser.write(html);
    parser.end();
    return text;
}

/**
 * Parse HTML page and extract the content as flat text.
 * Some special rules are set to focus only on the true text content ignoring
 * the nav bar, the demos, etc.
 */
async function extractTextFromHTMLPage(title, htmlFilePath) {
    const html = await fs.promises.readFile(htmlFilePath);
    const text = extractTextFromHTML(html);
    return cleanExcerpt(text, title);
}

module.exports = extractTextFromHTMLPage;

// Example use
if (require.main === module) {
    (async () => {
        const text = await extractTextFromHTMLPage(
            'User Block', './public/product/components/user-block/index.html'
            //'Size', './public/product/design-tokens/size/index.html',
        );
        console.debug(text);
    })();
}
