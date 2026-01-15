/** MDX AST utils */
const mdxUtils = {
    /** Extract raw text from the first H1 in tableOfContents. */
    getFirstH1Text(tableOfContents) {
        if (!tableOfContents || !tableOfContents.items) return null;
        const firstItem = tableOfContents.items && tableOfContents.items[0];
        if (firstItem && firstItem.title) {
            return firstItem.title;
        }
        return null;
    },
};

module.exports = mdxUtils;
