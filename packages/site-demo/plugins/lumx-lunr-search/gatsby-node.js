const lunr = require('lunr');
const fs = require('fs');
const fp = require('lodash/fp');

const ID_FIELD = 'id';

/**
 * Hook into gatsby node API and generate a search index with the plugin options.
 *
 * This plugin is inspired by https://github.com/humanseelabs/gatsby-plugin-lunr but without language support
 * (outside english) and without forcing the loading of the search index on page load (lazy loaded manually).
 */
async function generateLunrSearchIndex({ getNodesByType }, pluginOptions) {
    const {
        getDocumentsForTypes,
        fields = [],
        filename = 'search_index.json',
    } = pluginOptions;

    // List of fields to keep in doc store.
    const storeFieldNames = fields.map(f => f.store && f.name).filter(Boolean);
    // List of fields to index.
    const indexFields = fields.filter(f => f.index);

    // List documents to index.
    const documents = await Promise.all(
        Object.entries(getDocumentsForTypes)
            .flatMap(([type, getDocuments]) =>
                getNodesByType(type).map(getDocuments),
            ),
    );

    // Index documents.
    const store = {};
    const index = lunr(function() {
        this.ref(ID_FIELD);
        indexFields.forEach(({ name, attributes = {} }) => {
            this.field(name, attributes);
        });

        for (let i = 0; i < documents.length; i++) {
            const document = documents[i];
            if (!document) continue;

            // Index document in LunR.
            document[ID_FIELD] = i;
            this.add(document);

            // Store document by id.
            store[i] = fp.pick(storeFieldNames, document);
        }
    });

    const fullIndex = { index: index.toJSON(), store };

    await fs.promises.writeFile(`public/${filename}`, JSON.stringify(fullIndex));
}

if (process.env.NODE_ENV === 'production') {
    // Run on `onPostBootstrap` in PROD so the indexing can run against generated files.
    exports.onPostBuild = generateLunrSearchIndex;
} else {
    // Run on `onPostBootstrap` in DEV because there is no `onPostBuild` phase.
    exports.onPostBootstrap = generateLunrSearchIndex;
}
